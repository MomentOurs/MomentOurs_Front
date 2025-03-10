import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import CourseLayout from './course-layout';


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

    const [courses, setCourses] = useState<Course[]>([
        { courseId: 1, courseTitle: '2월 경주여행 (맛집 위주)', courseType: 'TRIP', courseStartDate: '2024-02-10', courseEndDate: '2024-02-12' },
        { courseId: 2, courseTitle: '2월 경주여행 (볼거리 위주)', courseType: 'TRIP', courseStartDate: '2024-02-10', courseEndDate: '2024-02-12' },
        { courseId: 3, courseTitle: '2월 경주여행 (최종)', courseType: 'TRIP', courseStartDate: '2024-02-10', courseEndDate: '2024-02-12' },
    ]);
    const [loading, setLoading] = useState(false); // API 없이 바로 표시하므로 false

    // 아래 주석은 api 요청 시 주석 해제
    // const [courses, setCourses] = useState<Course[]>([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetchCourses();
    // }, []);

    // const fetchCourses = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/course/folder/${folderId}`);
    //         if (!response.ok) throw new Error('Failed to fetch courses');
    //         const data = await response.json();
    //         setCourses(data);
    //     } catch (error) {
    //         console.error('Error fetching courses:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
        <CourseLayout>
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
                            <View style={styles.courseCheckboxContainer}>
                                <View style={[styles.courseCheckbox, selectedCourses.includes(item.courseId) && styles.courseCheckboxSelected]} />
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
                <TouchableOpacity style={styles.deleteConfirmButton} onPress={() => setShowDeleteModal(true)}>
                    <Text style={styles.deleteConfirmText}>삭제하기</Text>
                </TouchableOpacity>
            )}

            <Modal visible={showDeleteModal} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            {selectedCourses.length > 1 ? 
                                `${selectedCourses.length}개의 일정을 정말 삭제하시겠습니까?` :
                                `"${courses.find(c => c.courseId === selectedCourses[0])?.courseTitle}"\n일정을 정말 삭제하시겠습니까?`
                            }
                        </Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowDeleteModal(false)}>
                                <Text style={styles.modalCancelText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmDelete}>
                                <Text style={styles.modalConfirmText}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        padding: 16,
        borderBottomColor: '#ddd',
    },
    courseFolderTitle: {
        fontSize: 20,
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
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
    },
    courseCheckboxContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseCheckbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
    },
    courseCheckboxSelected: {
        backgroundColor: '#FF6F61',
        borderColor: '#FF6F61',
    },
    courseTextContainer: {
        flex: 1,
        marginLeft: 5,
    },
    courseTitle: {
        fontSize: 16,
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
    deleteConfirmButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    deleteConfirmText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
    },
    modalCancelButton: {
        padding: 10,
        marginRight: 10,
    },
    modalCancelText: {
        color: '#888',
    },
    modalConfirmButton: {
        padding: 10,
        backgroundColor: '#FF6F61',
        borderRadius: 5,
    },
    modalConfirmText: {
        color: '#FFF',
    },
});

export default CourseFolderDetail;