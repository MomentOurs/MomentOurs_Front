import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface Folder {
  courseScrapFolderId: number;
  folderName: string;
}

interface FavoriteScrapModalProps {
  visible: boolean;
  type: 'empty' | 'select' | 'confirm';
  courseTitle: string;
  folderList?: Folder[];
  selectedFolderId?: number;
  onSelectFolder?: (folderId: number) => void;
  onCreateFolder: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

const FavoriteScrapModal = ({
  visible,
  type,
  courseTitle,
  folderList = [],
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onConfirm,
  onClose,
}: FavoriteScrapModalProps) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {type === 'empty' && (
            <>
              <Text style={styles.title}>즐겨찾기 폴더가 비어있어요</Text>
              <Text style={styles.sub}>즐겨찾기 폴더를 만들어 편하게 관리해 보세요!</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton} onPress={onCreateFolder}>
                  <Text style={styles.createText}>생성하기</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {type === 'select' && (
            <>
              <Text style={styles.title}>즐겨찾기 폴더 담기</Text>
              <FlatList
                data={folderList}
                keyExtractor={(item) => item.courseScrapFolderId.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.folderItem, item.courseScrapFolderId === selectedFolderId && styles.selectedFolderItem]}
                    onPress={() => onSelectFolder?.(item.courseScrapFolderId)}
                  >
                    <Text
                      style={item.courseScrapFolderId === selectedFolderId ? styles.selectedFolderText : styles.folderText}
                    >
                      {item.folderName}에 담기
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createButton} onPress={onConfirm}>
                  <Text style={styles.createText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {type === 'confirm' && (
            <>
              <Text style={styles.title}>즐겨찾기 폴더 담기</Text>
              <Text style={styles.sub}>폴더에 <Text style={styles.highlight}>{courseTitle}</Text> 코스를 저장했어요!</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>확인</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FavoriteScrapModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '60%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  sub: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  highlight: {
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontSize: 14,
  },
  createButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FF6F61',
    marginLeft: 8,
    alignItems: 'center',
  },
  createText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  folderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  folderText: {
    fontSize: 14,
    color: '#888',
  },
  selectedFolderItem: {
    backgroundColor: '#FFE5E0',
  },
  selectedFolderText: {
    fontSize: 14,
    color: '#FF6F61',
    fontWeight: 'bold',
  },
});
