import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import CourseLayout from './course-layout';
import CourseDeleteConfirmModal from '../../components/modals/course/CourseDeleteConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ScrappedCourse = {
  courseId: number;
  courseTitle: string;
  courseType: 'DATE' | 'TRIP';
  courseStartDate: string;
  courseEndDate: string;
};

type RouteParams = {
  courseScrapFolderId: number;
  folderName: string;
  courses?: ScrappedCourse[];
};

const FavoriteFolderDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
  const { courseScrapFolderId, folderName, courses: initialCourses } = route.params as RouteParams;

  const [courses, setCourses] = useState<ScrappedCourse[]>(initialCourses ?? []);
  const [loading, setLoading] = useState(!initialCourses);

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!initialCourses) {
      fetchCoursesInFolder();
    }
  }, [courseScrapFolderId]);  

  const fetchCoursesInFolder = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/course/${courseScrapFolderId}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const mapped = data.map((item: ScrappedCourse) => ({
        courseId: item.courseId,
        courseTitle: item.courseTitle,
        courseType: item.courseType,
        courseStartDate: item.courseStartDate,
        courseEndDate: item.courseEndDate,
      }));           
      setCourses(mapped);
    } catch (error) {
      console.error('❌ 즐겨찾기 코스 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedCourses([]);
  };

  const toggleSelectCourse = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setCourses(prev => prev.filter(course => !selectedCourses.includes(course.courseId)));
    setIsDeleteMode(false);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }

  return (
    <CourseLayout selectedTab="즐겨찾기" onTabSelect={() => {}}>
      <View style={styles.courseFolderHeader}>
        <Text style={styles.courseFolderTitle}>{folderName}</Text>
        <TouchableOpacity style={styles.courseDeleteButton} onPress={toggleDeleteMode}>
          <Image source={require('../../../assets/trash.png')} style={styles.courseDeleteIcon} />
          <Text style={styles.courseDeleteButtonText}>{isDeleteMode ? '취소' : '삭제'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.courseId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() => {
              if (isDeleteMode) toggleSelectCourse(item.courseId);
              else navigation.navigate('OtherCourseDetail', {
                courseId: item.courseId,
                courseTitle: item.courseTitle,
                courseType: item.courseType,
                courseStartDate: item.courseStartDate,
                courseEndDate: item.courseEndDate,
              });              
            }}
          >
            {isDeleteMode && (
              <View style={styles.checkboxWrapper}>
                <View style={styles.checkbox}>
                  {selectedCourses.includes(item.courseId) && <View style={styles.checkboxSelected} />}
                </View>
              </View>
            )}
            <View style={styles.courseTextContainer}>
              <Text style={styles.courseTitle}>{item.courseTitle}</Text>
            </View>
            <Text style={[styles.courseType, item.courseType === 'TRIP' ? styles.tripType : styles.dateType]}>
              {item.courseType === 'TRIP' ? '여행' : '데이트'}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isDeleteMode && selectedCourses.length > 0 && (
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.deleteConfirmButton} onPress={() => setShowDeleteModal(true)}>
            <Text style={styles.registerButtonText}>삭제하기</Text>
          </TouchableOpacity>
        </View>
      )}

      <CourseDeleteConfirmModal
        visible={showDeleteModal}
        courseName={
          selectedCourses.length > 1
            ? `${selectedCourses.length}개의 장소`
            : courses.find(c => c.courseId === selectedCourses[0])?.courseTitle ?? ''
        }
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </CourseLayout>
  );
};

export default FavoriteFolderDetailScreen;

const styles = StyleSheet.create({
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  courseFolderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8 },
  courseFolderTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF6F61' },
  courseDeleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3,
  },
  courseDeleteIcon: { width: 14, height: 14, marginRight: 6, tintColor: '#888' },
  courseDeleteButtonText: { fontSize: 12, color: '#888' },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxWrapper: { width: 32, alignItems: 'center', justifyContent: 'center' },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF6F61' },
  courseTextContainer: { flex: 1, marginLeft: 5 },
  courseTitle: { fontSize: 14, fontWeight: 'bold' },
  courseType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#E0F0FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tripType: { color: '#007AFF', backgroundColor: '#E0F0FF' },
  dateType: { color: '#FF6F61', backgroundColor: '#FFE0E0' },
  bottomButtons: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  deleteConfirmButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});
