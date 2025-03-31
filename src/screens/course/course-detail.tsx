import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Animated, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import CourseLayout from './course-layout';
import CourseLocationDeleteModal from '../../components/modals/course/CourseLocationDeleteModal';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_BASE_URL } from '@env';

type DateCourseLocation = {
    courseLocationId: number;
    courseId: number;
    locationId: number;
    locationName: string;
    address: string;
    latitude: number;
    longitude: number;
    sequence: number;
    courseMemo?: string;
};

const dummyLocations: DateCourseLocation[] = [
    { courseLocationId: 1, courseId: 1, locationId: 1, locationName: '황리단길', address: '경상북도 경주시 황남동 포석로 일대', latitude: 35.8344, longitude: 129.2043, sequence: 1, courseMemo: '핫플레이스 카페 및 맛집 밀집 지역' },
    { courseLocationId: 2, courseId: 1, locationId: 2, locationName: '포석정지', address: '경상북도 경주시 배동 남산순환로 816', latitude: 35.7861, longitude: 129.2914, sequence: 2, courseMemo: '신라 왕궁의 역사적인 장소' },
    { courseLocationId: 3, courseId: 1, locationId: 3, locationName: '하나로마트 경주농협본점', address: '경상북도 경주시 태종로 717', latitude: 35.8429, longitude: 129.2121, sequence: 3, courseMemo: '지역 특산물을 저렴하게 구매 가능' },
];

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

    const [locations, setLocations] = useState<DateCourseLocation[]>(dummyLocations);
    const [mapData, setMapData] = useState<{ addresses?: { x: string; y: string }[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isMapVisible, setIsMapVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ✅ 실제 API 연동 시 활성화
    // const fetchCourseLocations = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/course/${courseId}/locations`);
    //         if (!response.ok) throw new Error('Failed to fetch locations');
    //         const data = await response.json();
    //         setLocations(data);
    //     } catch (error) {
    //         console.error('Error fetching locations:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchNaverMapData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${NAVER_BASE_URL}/map-reversegeocode/v2/gc?coords=129.2043,35.8344&orders=addr&output=json`, {
                method: 'GET',
                headers: {
                    'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
                    'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`네이버 지도 API 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            setMapData(data);
            console.log('네이버 지도 데이터:', data);
        } catch (error) {
            console.error('네이버 지도 데이터 가져오기 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
        // fetchCourseLocations(); // 🔹 API 연동 시 주석 해제
    }, []);

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setSelectedLocations([]);
    };

    const toggleSelectLocation = (locationId: number) => {
        setSelectedLocations((prev) =>
            prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId]
        );
    };

    const confirmDelete = () => {
        setShowDeleteModal(false);
        setLocations(locations.filter(loc => !selectedLocations.includes(loc.courseLocationId)));
        setIsDeleteMode(false);
    };

    const toggleMapView = async () => {
        if (!isMapVisible) {
            setIsMapVisible(true);
            setLoading(true);

            await fetchNaverMapData();
            Animated.timing(slideAnim, {
                toValue: 250,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setIsMapVisible(false));
        }
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
            <View style={styles.courseHeader}>
                <View>
                    <Text style={styles.courseTitle}>{courseTitle}</Text>
                    <Text style={styles.courseDate}>{courseStartDate} ~ {courseEndDate}</Text>
                </View>
                <TouchableOpacity style={styles.mapButton} onPress={toggleMapView}>
                    <Text style={styles.mapButtonText}>{isMapVisible ? "지도 닫기" : "지도 보기"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={toggleDeleteMode}>
                    <Image source={require('../../../assets/trash.png')} style={styles.deleteIcon} />
                    <Text style={styles.deleteButtonText}>{isDeleteMode ? "취소" : "삭제"}</Text>
                </TouchableOpacity>
            </View>

            <Animated.View style={[
                styles.mapContainer, 
                { height: slideAnim }
            ]}>
                {isMapVisible && (
                    <NaverMapView
                        style={{ width: '100%', height: 250 }}
                        initialCamera={{
                            latitude: locations.length > 0 ? locations[0].latitude : 35.8344,
                            longitude: locations.length > 0 ? locations[0].longitude : 129.2043,
                            zoom: 10
                        }}
                        mapType="Basic"
                        isShowLocationButton={true}
                    >
                        {locations.map((location) => (
                            <NaverMapMarkerOverlay
                                key={location.courseLocationId}
                                latitude={location.latitude}
                                longitude={location.longitude}
                                width={30}
                                height={40}
                            />
                        ))}
                    </NaverMapView>
                )}
            </Animated.View>

            <FlatList
                data={locations}
                keyExtractor={(item) => item.courseLocationId.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.locationItem}
                        onPress={() => isDeleteMode ? toggleSelectLocation(item.courseLocationId) : null}
                    >
                        <View style={styles.locationRow}>
                            {isDeleteMode && (
                                <TouchableOpacity onPress={() => toggleSelectLocation(item.courseLocationId)} style={styles.checkboxWrapper}>
                                <View style={styles.checkbox}>
                                    {selectedLocations.includes(item.courseLocationId) && <View style={styles.checkboxSelected} />}
                                </View>
                                </TouchableOpacity>
                            )}

                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationName}>{item.locationName}</Text>
                                <Text style={styles.locationAddress}>{item.address}</Text>
                                {item.courseMemo && <Text style={styles.courseMemo}>{item.courseMemo}</Text>}
                            </View>

                            {!isDeleteMode && (
                                <TouchableOpacity style={styles.memoryButton} onPress={() => console.log(`${item.locationName} 추억 보기`)}>
                                <Text style={styles.memoryButtonText}>추억 보기</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
                
            {isDeleteMode ? (
                selectedLocations.length > 0 && (
                    <View style={styles.bottomButtons}>
                    <TouchableOpacity 
                        style={styles.deleteConfirmButton}
                        onPress={() => setShowDeleteModal(true)}
                    >
                        <Text style={styles.registerButtonText}>삭제하기</Text>
                    </TouchableOpacity>
                    </View>
                )
                ) : (
                !isMapVisible && (
                    <View style={styles.bottomButtons}>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => navigation.navigate('CourseLocationSearch')}
                        >
                            <Text style={styles.addButtonText}>장소 추가</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.registerButton}
                            onPress={() => console.log('일정 등록')}
                        >
                            <Text style={styles.registerButtonText}>일정 등록</Text>
                        </TouchableOpacity>
                    </View>
                )
                )}

            <CourseLocationDeleteModal
                visible={showDeleteModal}
                selectedCount={selectedLocations.length}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
            />
        </CourseLayout>
    );
};

const styles = StyleSheet.create({
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    courseHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, paddingLeft: 12, paddingRight: 12 },
    courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF6F61', marginRight: 20 },
    courseDate: { fontSize: 12, color: '#666' },
    deleteButton: {flexDirection: 'row',alignItems: 'center',backgroundColor: '#fff',paddingVertical: 8,paddingHorizontal: 8,borderRadius: 8, borderWidth: 1,borderColor: '#E0E0E0',elevation: 3,},
    deleteIcon: { width: 14, height: 14, marginRight: 6, tintColor: '#888' },
    deleteButtonText: { fontSize: 12, color: '#888' },
    mapContainer: { width: '100%', height: 250,overflow: 'hidden', backgroundColor: 'white', paddingTop: 10 },
    mapButton: {backgroundColor: '#FF6F61',paddingVertical: 9.5, paddingHorizontal: 8, borderRadius: 8, alignSelf: 'center',},
    mapButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    closeMapButton: {backgroundColor: '#FF6F61',paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, alignSelf: 'center',},
    closeMapButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    locationItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    locationRow: {flexDirection: 'row',alignItems: 'center',},
    locationTextContainer: { flex: 1, marginHorizontal: 10, },
    locationName: { fontSize: 16, fontWeight: 'bold' },
    locationAddress: { fontSize: 12, color: '#666' },
    memoryButton: {backgroundColor: '#FFF0F0',borderRadius: 12,paddingVertical: 6,paddingHorizontal: 10,marginLeft: 10,},
    memoryButtonText: {color: '#FF6F61',fontWeight: 'bold',fontSize: 12,},
    courseMemo: { fontSize: 12, color: '#888', fontStyle: 'italic' },
    checkboxWrapper: {width: 32, alignItems: 'center', justifyContent: 'center',},
    checkbox: {width: 20,height: 20,borderRadius: 10,borderWidth: 2,borderColor: '#888',justifyContent: 'center',alignItems: 'center',},
    checkboxSelected: {width: 12,height: 12,borderRadius: 6,backgroundColor: '#FF6F61',borderColor: '#FF6F61', },
    bottomButtons: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16},
    addButton: {backgroundColor: '#FFF',borderColor: '#E0E0E0',borderWidth: 1,paddingVertical: 8,paddingHorizontal: 20,borderRadius: 10,flex: 1,marginRight: 8,alignItems: 'center'},
    addButtonText: { fontSize: 14, color: '#888' },
    registerButton: {backgroundColor: '#FF6F61',paddingVertical: 8,paddingHorizontal: 20,borderRadius: 10,flex: 1,alignItems: 'center',},
    registerButtonText: {color: '#FFF',fontSize: 14,fontWeight: 'bold',},
    deleteConfirmButton: {backgroundColor: '#FF6F61',paddingVertical: 12,paddingHorizontal: 20,borderRadius: 10,flex: 1,alignItems: 'center',},
});

export default CourseDetail;
