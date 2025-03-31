import React, { useLayoutEffect, useState } from 'react';
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

const dummyFolders: Folder[] = [
  { id: 1, title: '경주 여행 폴더' },
  { id: 2, title: '맛집 리스트' },
];

const CourseFolderSelectScreen = () => {
  const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();

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

  const handleProceed = () => {
    if (isCreatingNew) {
      if (!newFolderTitle.trim()) {
        Alert.alert('알림', '폴더 제목을 입력해주세요.');
        return;
      }

      const newFolderId = Date.now();

      navigation.navigate('CourseCreate', {
        folderId: newFolderId,
        folderTitle: newFolderTitle,
      });
    } else {
      const selected = dummyFolders.find((f) => f.id === selectedFolderId);
      if (!selected) {
        Alert.alert('알림', '기존 폴더를 선택하거나 새 폴더를 생성해주세요.');
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
        data={dummyFolders}
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
