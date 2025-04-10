import React, { useCallback, useEffect, useState } from 'react';
import {View,Text,FlatList,Image,TouchableOpacity,ActivityIndicator,StyleSheet,} from 'react-native';
import CourseLayout from '../../src/screens/course/course-layout';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../../src/screens/course/course-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Folder {
  courseScrapFolderId: number;
  folderName: string;
  folderDescription?: string
  courseCount: number;
  folderImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

const FavoriteCourseTab = ({ refresh }: { refresh?: boolean }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
  const route = useRoute();

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteFolders();
    }, [])
  );
  
  const fetchFavoriteFolders = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8080/api/course-scrap-folder', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error('Failed to fetch favorite folders');
  
      const data = await response.json();
  
      setFolders(data);
    } catch (error) {
      console.error('❌ Error fetching favorite folders:', error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <CourseLayout selectedTab="즐겨찾기" onTabSelect={() => {}}>
      <TouchableOpacity
        style={[styles.createFolderButton, { padding: 7 }]}
        onPress={() => navigation.navigate('FavoriteFolderCreate')}
      >
        <Image source={require('../../assets/add-square.png')} style={styles.createFolderIcon} />
        <Text style={styles.createFolderText}>폴더 만들기</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      ) : folders.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>새로운 폴더를 생성해 보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={folders}
          keyExtractor={(item) => item.courseScrapFolderId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.folderItem} 
            onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/api/course/${item.courseScrapFolderId}/courses`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
            
                if (!response.ok) throw new Error('코스 조회 실패');
            
                const data = await response.json();
            
                const courses = data.map((item: any) => ({
                  courseId: item.courseId,
                  courseTitle: item.courseTitle,
                  courseType: item.courseType,
                  courseStartDate: item.courseStartDate,
                  courseEndDate: item.courseEndDate,
                }));
            
                navigation.navigate('FavoriteFolderDetail', {
                  courseScrapFolderId: item.courseScrapFolderId,
                  folderName: item.folderName,
                  courses,
                });
              } catch (e) {
                console.error('❌ 폴더 코스 미리 조회 실패:', e);
              }
            }}
            >
              {item.folderImage && (
                <Image
                  source={{ uri: item.folderImage }}
                  style={styles.folderImage}
                />
              )}
              <View>
                <Text style={styles.folderTitle}>{item.folderName}</Text>
                <Text style={styles.folderDescription}>{item.folderDescription ?? ''}</Text>
                <Text style={styles.folderCourseCount}>{item.courseCount}개</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </CourseLayout>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  createFolderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 7,
    marginBottom: 10,
  },
  createFolderIcon: {
    width: 14,
    height: 14,
    tintColor: '#888',
    marginLeft: 1,
    marginRight: 10,
  },
  createFolderText: {
    color: '#888',
    fontSize: 14,
  },  
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  folderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  folderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  folderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  folderDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  folderCourseCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default FavoriteCourseTab;
