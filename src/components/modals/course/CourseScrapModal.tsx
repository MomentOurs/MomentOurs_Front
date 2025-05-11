import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Image } from 'react-native';
import { Folder } from '../../../hooks/UseScrapCourse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

interface CourseScrapModalProps {
  visible: boolean;
  status: 'empty' | 'select' | 'confirm';
  folders: Folder[];
  selectedFolderId: number | null;
  courseId: number;
  setSelectedFolderId: (id: number) => void;
  scrapTargetName: string;
  onCreatePress: () => void;
  onConfirmPress: () => void;
  onClose: () => void;
}

const CourseScrapModal = ({
  visible,
  status,
  folders,
  selectedFolderId,
  courseId,
  setSelectedFolderId,
  scrapTargetName,
  onCreatePress,
  onConfirmPress,
  onClose,
}: CourseScrapModalProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [foldersState, setFoldersState] = useState(folders);

  useEffect(() => {
    setFoldersState(folders);
  }, [folders]);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setNewImage(result.assets[0].uri || null);
    }
  };

  const handleCreateFolderAndScrap = async () => {
    if (!newTitle.trim()) {
      Alert.alert('알림', '폴더 제목을 입력해주세요.');
      return;
    }
  
    const formData = new FormData();
    formData.append('folderName', newTitle);
    formData.append('folderDescription', newDescription);
    if (newImage) {
      formData.append('folderImage', {
        uri: newImage,
        type: 'image/jpeg',
        name: 'folder.jpg',
      } as any);
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const folderRes = await fetch('http://localhost:8080/api/course-scrap-folder', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
  
      const folderData = await folderRes.json();
      const folderId = folderData.courseScrapFolderId;
      const folderName = folderData.folderName;

      if (!folderRes.ok || !folderId) throw new Error('폴더 생성 실패');  
      const newFolder = {
        courseScrapFolderId: folderId,
        folderName: folderName,
      };
  
      setFoldersState((prev) => [...prev, newFolder]);
      setSelectedFolderId(newFolder.courseScrapFolderId);
  
      const scrapRes = await fetch('http://localhost:8080/api/course-scrap', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseScrapFolderId: newFolder.courseScrapFolderId,
          courseId: courseId,
        }),
      });
  
      if (!scrapRes.ok) throw new Error('코스 등록 실패');
  
      setIsCreatingNew(false);
      setNewTitle('');
      setNewDescription('');
      setNewImage(null);
      onClose();
    } catch (err) {
      Alert.alert('오류', '폴더 생성 또는 코스 등록 중 오류가 발생했습니다.');
      console.error(err);
    }
  };
  
  const handleConfirmScrap = async () => {
    if (!selectedFolderId) {
      Alert.alert('알림', '폴더를 선택해주세요.');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/course-scrap', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseScrapFolderId: selectedFolderId,
          courseId: courseId,
        }),
      });
  
      if (!response.ok) throw new Error('코스 등록 실패');
  
      onClose();
    } catch (err) {
      Alert.alert('오류', '코스 등록 중 오류가 발생했습니다.');
      console.error(err);
    }
  };  

  const handleConfirm = async () => {
    if (isCreatingNew) {
      await handleCreateFolderAndScrap();
    } else {
      await handleConfirmScrap();
    }
  };
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          {status === 'empty' && (
            <>
              <Text style={styles.title}>즐겨찾기 폴더가 비어있어요</Text>
              <Text style={styles.subtitle}>즐겨찾기 폴더를 만들어 편하게 관리해 보세요!</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={onCreatePress}>
                  <Text style={styles.confirmText}>생성하기</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {status === 'select' && (
            <>
              <Text style={styles.title}>즐겨찾기 폴더 담기</Text>

              {!isCreatingNew && (
                <>
                  <TouchableOpacity style={styles.selectBox} onPress={() => setDropdownOpen(!dropdownOpen)}>
                    <Text style={styles.selectedText}>
                      {selectedFolderId
                        ? folders.find(f => f.courseScrapFolderId === selectedFolderId)?.folderName + '에 담기'
                        : '폴더를 선택하세요'}
                    </Text>
                  </TouchableOpacity>

                  {dropdownOpen && (
                    <View style={styles.dropdown}>
                      <FlatList
                        data={foldersState}
                        keyExtractor={(item) => item.courseScrapFolderId.toString()}
                        renderItem={({ item }) => {
                          const isAlreadyScrapped = item.courseIds?.includes(courseId);

                          return (
                            <TouchableOpacity
                              style={[
                                styles.dropdownItem,
                                isAlreadyScrapped && { opacity: 0.4 },
                              ]}
                              disabled={isAlreadyScrapped}
                              onPress={() => {
                                setSelectedFolderId(item.courseScrapFolderId);
                                setDropdownOpen(false);
                              }}
                            >
                              <Text style={styles.dropdownItemText}>
                                {item.folderName}
                                {isAlreadyScrapped && ' (이미 담겨있음)'}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </View>
                  )}

                  <TouchableOpacity onPress={() => setIsCreatingNew(true)}>
                    <Text style={{ color: '#FF6F61', marginTop: 10, fontWeight: 'bold' }}>+ 새 폴더 만들기</Text>
                  </TouchableOpacity>
                </>
              )}

              {isCreatingNew && (
                <View style={{ width: '100%', marginTop: 16 }}>
                  <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
                    {newImage ? (
                      <Image source={{ uri: newImage }} style={styles.imagePreview} />
                    ) : (
                      <Text style={{ color: '#999' }}>이미지 선택</Text>
                    )}
                  </TouchableOpacity>
                  <TextInput
                    style={styles.input}
                    placeholder="폴더 제목"
                    value={newTitle}
                    onChangeText={setNewTitle}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="폴더 설명 (선택)"
                    value={newDescription}
                    onChangeText={setNewDescription}
                  />
                </View>
              )}

              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={handleConfirm}
                  disabled={
                    isCreatingNew
                      ? !newTitle
                      : !selectedFolderId ||
                        folders.find(f => f.courseScrapFolderId === selectedFolderId)?.courseIds?.includes(courseId)
                  }
                >
                  <Text style={styles.confirmText}>코스 등록</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {status === 'confirm' && (
            <>
              <Text style={styles.title}>즐겨찾기 폴더 담기</Text>
              <Text style={styles.subtitle}>
                <Text style={styles.folderText}>{folders.find(f => f.courseScrapFolderId === selectedFolderId)?.folderName}</Text> 폴더에
                <Text style={styles.courseText}> {scrapTargetName}</Text> 코스를 저장했어요!
              </Text>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={onConfirmPress}
                disabled={!selectedFolderId}
              >
                <Text style={styles.confirmText}>코스 등록</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 16,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 12,
    width: '100%',
  },
  
  selectedText: {
    fontSize: 14,
    color: '#333',
  },
  
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    width: '100%',
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  
  dropdownItemText: {
    fontSize: 14,
    color: '#444',
  },
  
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelText: {
    color: '#444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  folderItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 6,
    width: '100%',
  },
  selectedFolder: {
    borderColor: '#FF6F61',
    backgroundColor: '#FFF0EE',
  },
  folderText: {
    fontSize: 14,
    color: '#888',
  },
  courseText: {
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  imagePicker: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },  
});

export default CourseScrapModal;
