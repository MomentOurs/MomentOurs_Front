import React, { useCallback, useEffect, useState } from 'react';
import {View,Text,FlatList,Image,TouchableOpacity,ActivityIndicator,StyleSheet,} from 'react-native';
import CourseLayout from '../../src/screens/course/course-layout';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../../src/screens/course/course-navigation';
import * as SecureStore from 'expo-secure-store';

interface Folder {
  course_scrap_folder_id: number;
  folder_name: string;
  course_count: number;
  folder_image?: string;
}

const FavoriteCourseTab = ({ refresh }: { refresh?: boolean }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
  const route = useRoute();

  useEffect(() => {
    fetchFavoriteFolders();
  }, []);  

  useFocusEffect(
    useCallback(() => {
      fetchFavoriteFolders();
    }, [])
  );
  
  const fetchFavoriteFolders = async () => {
    try {
        const token = await SecureStore.getItemAsync('accessToken');
        // const token = '(로그인 후 액세스 토큰 입력)';
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
        style={styles.createFolderButton}
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
          keyExtractor={(item) => item.course_scrap_folder_id.toString()}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.folderItem}>
              {item.folder_image && (
                <Image
                  source={{ uri: item.folder_image }}
                  style={styles.folderImage}
                />
              )}
              <View>
                <Text style={styles.folderTitle}>{item.folder_name}</Text>
                <Text style={styles.folderCourseCount}>{item.course_count}개</Text>
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
    margin: 10,
  },
  createFolderIcon: {
    width: 14,
    height: 14,
    tintColor: '#888',
    marginRight: 6,
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
  folderCourseCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
});

export default FavoriteCourseTab;
