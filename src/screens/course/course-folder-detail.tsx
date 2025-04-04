import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import CourseLayout from './course-layout';
import CourseDeleteConfirmModal from '../../components/modals/course/CourseDeleteConfirmModal';
import * as SecureStore from 'expo-secure-store';

type Course = {
    courseId: number;
    courseTitle: string;
    courseType: 'DATE' | 'TRIP';
    courseStartDate: string;
    courseEndDate: string;
};

const CourseFolderDetail = () => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
    const route = useRoute();
    const { folderId, folderTitle, folderDescription } = route.params as { folderId: number; folderTitle: string; folderDescription: string };
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);
    
    const fetchCourses = async () => {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            // const token = '(로그인 후 액세스 토큰 입력)';
            const response = await fetch(`http://localhost:8080/api/course/folder/${folderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) throw new Error('Failed to fetch courses');
            const data = await response.json();
    
            const mappedCourses = data.map((item: any) => ({
                courseId: item.courseId,
                courseTitle: item.courseTitle,
                courseType: item.courseType,
                courseStartDate: item.courseStartDate,
                courseEndDate: item.courseEndDate,
            }));
          
            setCourses(mappedCourses);
        } catch (error) {
            console.error('폴더 내 코스 조회 실패:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const [selectedTab, setSelectedTab] = useState('내 코스');
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedCourses([]);
    };

    const toggleSelectCourse = (courseId: number) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
        );
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        setCourses(courses.filter(course => !selectedCourses.includes(course.courseId)));
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
        <CourseLayout
        selectedTab="내 코스"
        onTabSelect={() => {}}
        >
            <View style={styles.courseFolderHeader}>
                <View>
                    <Text style={styles.courseFolderTitle}>{folderTitle}</Text>
                    <Text style={styles.courseFolderDescription}>{folderDescription}</Text>
                </View>
                <TouchableOpacity style={styles.courseDeleteButton} onPress={toggleDeleteMode}>
                    <Image source={require('../../../assets/trash.png')} style={styles.courseDeleteIcon} />
                    <Text style={styles.courseDeleteButtonText}>{isDeleteMode ? "취소" : "삭제"}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={courses}
                keyExtractor={(item) => item.courseId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.courseItem}
                        onPress={() => {
                            if (isDeleteMode) {
                                toggleSelectCourse(item.courseId);
                            } else {
                                navigation.navigate('CourseDetail', { 
                                    courseId: item.courseId,
                                    courseTitle: item.courseTitle,
                                    courseType: item.courseType,
                                    courseStartDate: item.courseStartDate,
                                    courseEndDate: item.courseEndDate
                                });
                            }
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
                        ? `${selectedCourses.length}개의 일정`
                        : courses.find(c => c.courseId === selectedCourses[0])?.courseTitle ?? ''
                }
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </CourseLayout>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseFolderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: '#ddd',
    },
    courseFolderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6F61',
    },
    courseFolderDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    courseDeleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginLeft: 8,
        elevation: 3,
    },
    courseDeleteIcon: {
        width: 14,
        height: 14,
        marginRight: 6,
        tintColor: '#888',
    },
    courseDeleteButtonText: {
        fontSize: 12,
        color: '#888',
    },
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
    checkboxWrapper: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
      },
      checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
      },
      checkboxSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF6F61',
      },
    courseTextContainer: {
        flex: 1,
        marginLeft: 5,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    courseType: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#007AFF',
        backgroundColor: '#E0F0FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    tripType: {
        color: '#007AFF',
        backgroundColor: '#E0F0FF',
    },
    dateType: {
        color: '#FF6F61',
        backgroundColor: '#FFE0E0',
    },
    bottomButtons: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
      },
      deleteConfirmButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
      },
      registerButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
      },
});

export default CourseFolderDetail;