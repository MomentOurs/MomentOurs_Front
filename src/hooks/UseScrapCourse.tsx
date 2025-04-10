import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export interface Folder {
  courseScrapFolderId: number;
  folderName: string;
  courseIds?: number[];
}

export const useScrapCourse = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [status, setStatus] = useState<'empty' | 'select' | 'confirm'>('select');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [scrapTargetName, setScrapTargetName] = useState('');

  const openScrapModal = useCallback((courseName: string) => {
    setScrapTargetName(courseName);
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/course-scrap-folder', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error('폴더 조회 실패');

      setFolders(data);
      setStatus(data.length === 0 ? 'empty' : 'select');
      setIsModalVisible(true);
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '폴더 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleCreateNavigate = (navigate: any) => {
    setIsModalVisible(false);
    navigate('FavoriteFolderCreate', { fromScrap: true });
  };

  const handleScrap = async (courseId: number) => {
    if (!selectedFolderId) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/course-scrap', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          courseScrapFolderId: selectedFolderId,
        }),
      });

      if (!response.ok) throw new Error('스크랩 실패');

      setStatus('confirm');
    } catch (e) {
      Alert.alert('오류', '즐겨찾기 등록 중 문제가 발생했습니다.');
    }
  };

  return {
    folders,
    status,
    selectedFolderId,
    setSelectedFolderId,
    scrapTargetName,
    isModalVisible,
    setIsModalVisible,
    openScrapModal,
    handleCreateNavigate,
    handleScrap,
  };
};
