import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Folder = {
  id: number;
  title: string;
};

const CourseFolderSelectScreen = () => {
  const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri || null);
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        // const token = await SecureStore.getItemAsync('accessToken');
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6ImNobzk3NTlAZ21haWwuY29tIiwicm9sZSI6IlJPTEVfQ09VUExFIiwiaWF0IjoxNzQzNTk4NTUxLCJleHAiOjQ4Mzk5NTk4NTUxfQ.HAT3ySMyvOWwOkbHrs3gnDINrnGT-4GSdvSJwfnxMW8';
        const response = await fetch('http://localhost:8080/api/course-folder', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error('폴더 조회 실패');
        const data = await response.json();
  
        const mapped = data.map((item: any) => ({
          id: item.folder_id,
          title: item.folder_name,
        }));
  
        setFolders(mapped);
      } catch (err) {
        console.error('❌ 폴더 조회 실패:', err);
      }
    };
  
    fetchFolders();
  }, []);

  const handleProceed = async () => {
    if (isCreatingNew) {
      if (!newFolderTitle.trim()) {
        Alert.alert('알림', '폴더 제목을 입력해주세요.');
        return;
      }
  
      try {
        // const token = await SecureStore.getItemAsync('accessToken');
        // const token = '(로그인 후 액세스 토큰 입력)';
        const payload = {
          folder_name: newFolderTitle,
          folder_description: newFolderDescription, // optional
          folder_image: selectedImage,              // optional (base64 or url 처리)
        };
  
        const response = await fetch('http://localhost:8080/api/course-folder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) throw new Error('폴더 생성 실패');
        const data = await response.json();
  
        navigation.navigate('CourseCreate', {
          folderId: data.folder_id,
          folderTitle: data.folder_name,
        });
      } catch (err) {
        Alert.alert('오류', '폴더를 생성할 수 없습니다.');
        console.error(err);
      }
    } else {
      const selected = folders.find((f) => f.id === selectedFolderId);
      if (!selected) {
        Alert.alert('알림', '기존 폴더를 선택해주세요.');
        return;
      }
  
      navigation.navigate('CourseCreate', {
        folderId: selected.id,
        folderTitle: selected.title,
      });
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>폴더 선택</Text>

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.folderItem, selectedFolderId === item.id && styles.folderSelected]}
            onPress={() => {
              setIsCreatingNew(false);
              setSelectedFolderId(item.id);
            }}
          >
            <Text style={styles.folderText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.newFolderToggle}
        onPress={() => {
          setIsCreatingNew(true);
          setSelectedFolderId(null);
        }}
      >
        <Text style={styles.newFolderToggleText}>+ 새 폴더 만들기</Text>
      </TouchableOpacity>

      {isCreatingNew && (
        <View style={styles.inputArea}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              ) : (
                <Ionicons name="camera-outline" size={30} color="#ccc" />
              )}
            </TouchableOpacity>
          </View>
        
          <TextInput
            placeholder="폴더 제목"
            style={styles.input}
            value={newFolderTitle}
            onChangeText={setNewFolderTitle}
          />
          <TextInput
            placeholder="폴더 설명"
            style={styles.input}
            value={newFolderDescription}
            onChangeText={setNewFolderDescription}
          />
        </View>
      )}

      <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
        <Text style={styles.proceedText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CourseFolderSelectScreen;

const styles = StyleSheet.create({
  backButton: { paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  folderItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  folderSelected: {
    borderColor: '#FF6F61',
    backgroundColor: '#FFF0EF',
  },
  folderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  newFolderToggle: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  newFolderToggleText: {
    color: '#FF6F61',
    fontSize: 14,
  },
  inputArea: {
    marginTop: 16,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },  
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
  },
  proceedButton: {
    marginTop: 20,
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
