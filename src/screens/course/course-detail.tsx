import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CourseStackParamList } from './course-navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import CourseLayout from './course-layout';

type Location = {
    locationName: string;
    address: string;
    latitude: number;
    longitude: number;
    sequence: number;
    courseMemo?: string;
};

const dummyLocations: Location[] = [
    { locationName: '황리단길', address: '경상북도 경주시 황남동 포석로 일대', latitude: 35.8344, longitude: 129.2043, sequence: 1, courseMemo: '핫플레이스 카페 및 맛집 밀집 지역' },
    { locationName: '포석정지', address: '경상북도 경주시 배동 남산순환로 816', latitude: 35.7861, longitude: 129.2914, sequence: 2, courseMemo: '신라 왕궁의 역사적인 장소' },
    { locationName: '하나로마트 경주농협본점', address: '경상북도 경주시 태종로 717', latitude: 35.8429, longitude: 129.2121, sequence: 3, courseMemo: '지역 특산물을 저렴하게 구매 가능' },
];

const sequenceColors = ['#FF6F61', '#FFA07A', '#FFD700', '#90EE90', '#87CEEB'];

const CourseDetail = () => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
    const route = useRoute();
    const { courseId, courseTitle, courseType, courseStartDate, courseEndDate } = route.params as {
        courseId: number;
        courseTitle: string;
        courseType: 'DATE' | 'TRIP';
        courseStartDate: string;
        courseEndDate: string;
    };

    const [locations, setLocations] = useState<Location[]>(dummyLocations);
    const [loading, setLoading] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ✅ 실제 API 연동 버전 (주석 처리)
    //
    // const [locations, setLocations] = useState<Location[]>([]);
    // const [loading, setLoading] = useState(true); // 🔹 API 호출 전에는 true (로딩 중)
    //
    // useEffect(() => {
    //     fetchCourseLocations();
    // }, []);
    //
    // const fetchCourseLocations = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/course/${courseId}`);
    //         if (!response.ok) throw new Error('Failed to fetch locations');
    //         const data = await response.json();
    //         setLocations(data.locations); // 🔹 실제 API에서 받아온 데이터로 설정
    //     } catch (error) {
    //         console.error('Error fetching locations:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        setTimeout(() => {
            setLocations(dummyLocations);
            setLoading(false);
        }, 1000);
        // fetchCourseLocations(); // 🔹 API 연동 시 주석 해제
    }, []);

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedLocations([]);
    };

    const toggleSelectLocation = (locationName: string) => {
        setSelectedLocations((prev) =>
            prev.includes(locationName) ? prev.filter((name) => name !== locationName) : [...prev, locationName]
        );
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        setLocations(locations.filter(loc => !selectedLocations.includes(loc.locationName)));
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
            <View style={styles.courseHeader}>
                <View>
                    <Text style={styles.courseTitle}>{courseTitle}</Text>
                    <Text style={styles.courseDate}>{courseStartDate} ~ {courseEndDate}</Text>
                </View>
                <TouchableOpacity style={styles.deleteButton} onPress={toggleDeleteMode}>
                    <Image source={require('../../../assets/trash.png')} style={styles.deleteIcon} />
                    <Text style={styles.deleteButtonText}>{isDeleteMode ? "취소" : "삭제"}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={locations}
                keyExtractor={(item) => item.locationName}
                renderItem={({ item, index }) => (
                    <TouchableOpacity 
                        style={styles.locationItem}
                        onPress={() => isDeleteMode ? toggleSelectLocation(item.locationName) : null}
                    >
                        {isDeleteMode && (
                            <View style={styles.checkboxContainer}>
                                <View style={[styles.checkbox, selectedLocations.includes(item.locationName) && styles.checkboxSelected]} />
                            </View>
                        )}

                        <View style={[styles.sequenceCircle, { backgroundColor: sequenceColors[index % sequenceColors.length] }]}></View>

                        <View style={styles.locationTextContainer}>
                            <Text style={styles.locationName}>{item.locationName}</Text>
                            <Text style={styles.locationAddress}>{item.address}</Text>
                            {item.courseMemo && <Text style={styles.courseMemo}>{item.courseMemo}</Text>}
                        </View>
                    </TouchableOpacity>
                )}
            />

            {isDeleteMode && selectedLocations.length > 0 && (
                <TouchableOpacity style={styles.deleteConfirmButton} onPress={() => setShowDeleteModal(true)}>
                    <Text style={styles.deleteConfirmText}>삭제하기</Text>
                </TouchableOpacity>
            )}

            {!isDeleteMode && (
                <View style={styles.bottomButtons}>
                    <TouchableOpacity 
                        style={styles.addButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('CourseLocationSearch')}
                    >
                        <Text style={styles.addButtonText}>장소 추가</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.registerButton}
                        activeOpacity={0.7}
                        onPress={() => console.log('일정 등록')}
                    >
                        <Text style={styles.registerButtonText}>일정 등록</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={showDeleteModal} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            {selectedLocations.length > 1 ? 
                                `${selectedLocations.length}개의 장소를 삭제하시겠습니까?` :
                                `"${locations.find(loc => loc.locationName === selectedLocations[0])?.locationName}"\n장소를 삭제하시겠습니까?`
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
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6F61',
    },
    courseDate: {
        fontSize: 12,
        color: '#666',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    deleteIcon: {
        width: 14,
        height: 14,
        marginRight: 6,
        tintColor: '#888',
    },
    deleteButtonText: {
        fontSize: 12,
        color: '#888',
    },
    sequenceCircle: {
        width: 10,
        height: 10,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        marginRight: 10,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 2,
    },
    locationName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    locationAddress: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    courseMemo: {
        fontSize: 11,
        color: '#888',
        fontStyle: 'italic',
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
    checkboxContainer: {
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
    },
    checkboxSelected: {
        backgroundColor: '#FF6F61',
        borderColor: '#FF6F61',
    },
    locationTextContainer: {
        flex: 1,
        marginLeft: 5,
    },
    bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
        paddingVertical: 10,
    },
    addButton: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    addButtonText: {
        fontSize: 16,
        color: '#888',
    },
    registerButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    registerButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },    
});

export default CourseDetail;
