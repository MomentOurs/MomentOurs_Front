import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../course/course-navigation';

const FavoriteFolderCreateScreen = () => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
    const [folderTitle, setFolderTitle] = useState('');
    const [folderDescription, setFolderDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImagePick = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri || null);
        }
    };

  const handleCreateFolder = async () => {
    if (!folderTitle.trim()) {
      Alert.alert('알림', '폴더 제목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('folderName', folderTitle);
    formData.append('folderDescription', folderDescription);
    if (selectedImage) {
      formData.append('folderImage', {
        uri: selectedImage,
        name: 'folder.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      // const token = await SecureStore.getItemAsync('accessToken');
      // const token = '(로그인 후 액세스 토큰 입력)';
      const response = await fetch('http://localhost:8080/api/course-scrap-folder', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('생성 실패');

      Alert.alert('완료', '폴더가 생성되었습니다.');

      navigation.goBack();
      
    } catch (err) {
      Alert.alert('오류', '폴더 생성 중 문제가 발생했습니다.');
      console.error(err);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
        ),
    });
}, [navigation]);

  return (
    <View style={styles.container}>
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
        placeholderTextColor="#bbb"
        style={styles.input}
        value={folderTitle}
        onChangeText={setFolderTitle}
      />
      <TextInput
        placeholder="폴더 설명 (선택)"
        placeholderTextColor="#ccc"
        style={[styles.input, { color: '#444' }]}
        value={folderDescription}
        onChangeText={setFolderDescription}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateFolder}>
        <Text style={styles.createButtonText}>생성하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteFolderCreateScreen;

const styles = StyleSheet.create({
  backButton: {paddingHorizontal: 16,justifyContent: 'center',alignItems: 'center',},
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  imageWrapper: { alignItems: 'center', marginBottom: 16 },
  imagePicker: {
    width: 100, height: 100, borderRadius: 10,
    backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%', height: '100%', borderRadius: 10,
  },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
    padding: 12, fontSize: 14, marginBottom: 10,
    color: '#000',
  },
  createButton: {
    marginTop: 20, backgroundColor: '#FF6F61',
    paddingVertical: 12, borderRadius: 10, alignItems: 'center',
  },
  createButtonText: {
    color: '#fff', fontSize: 16, fontWeight: 'bold',
  },
});
