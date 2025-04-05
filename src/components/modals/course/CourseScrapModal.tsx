import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Folder } from '../../../hooks/UseScrapCourse';

interface CourseScrapModalProps {
  visible: boolean;
  status: 'empty' | 'select' | 'confirm';
  folders: Folder[];
  selectedFolderId: number | null;
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
  setSelectedFolderId,
  scrapTargetName,
  onCreatePress,
  onConfirmPress,
  onClose,
}: CourseScrapModalProps) => {
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
              <FlatList
                data={folders}
                keyExtractor={(item) => item.courseScrapFolderId.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.folderItem, selectedFolderId === item.courseScrapFolderId && styles.selectedFolder]}
                    onPress={() => setSelectedFolderId(item.courseScrapFolderId)}
                  >
                    <Text style={selectedFolderId === item.courseScrapFolderId ? styles.selectedText : styles.folderText}>
                      {item.folderName}에 담기
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmPress}>
                  <Text style={styles.confirmText}>확인</Text>
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
              <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
                <Text style={styles.confirmText}>확인</Text>
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
  selectedText: {
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  courseText: {
    color: '#FF6F61',
    fontWeight: 'bold',
  },
});

export default CourseScrapModal;
