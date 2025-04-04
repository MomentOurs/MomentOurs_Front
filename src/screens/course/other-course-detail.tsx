import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import CourseLayout from './course-layout';
import ReportModal from '../../components/modals/course/ReportModal';
import CourseScrapModal from '../../components/modals/course/CourseScrapModal';
import { useScrapCourse } from '../../hooks/UseScrapCourse';
import * as SecureStore from 'expo-secure-store';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NAVER_BASE_URL } from '@env';

type DateCourseLocation = {
  course_id: number;
  location_id: number;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  sequence: number;
  course_memo?: string;
};

type RouteParams = {
    courseId: number;
    courseTitle: string;
    courseType: 'DATE' | 'TRIP';
    courseStartDate: string;
    courseEndDate: string;
  };

const OtherCourseDetail = () => {
  const [locations, setLocations] = useState<DateCourseLocation[]>([]);
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId, courseTitle, courseType, courseStartDate, courseEndDate } = route.params as RouteParams;
  
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const {
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
  } = useScrapCourse();

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const token = await SecureStore.getItemAsync('accessToken');
        // const token = '(로그인 후 액세스 토큰 입력)';
        const response = await fetch(`http://localhost:8080/api/course/${courseId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('데이트 코스 상세 조회 실패');
        }
  
        const data = await response.json();
        setLocations(data.locations);
      } catch (error) {
        console.error('데이트 코스 상세 조회 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseDetail();
  }, [courseId]);  

  const handleReportSubmit = (reason) => {
    setShowReportModal(false);
    console.log('신고 사유:', reason);
  };

  const onAddToFavorite = () => {
    openScrapModal(courseTitle);
  };

  const toggleMapView = async () => {
    if (!isMapVisible) {
      setIsMapVisible(true);
      setLoading(true);
  
      Animated.timing(slideAnim, {
        toValue: 250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setLoading(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsMapVisible(false));
    }
  };
  

  return (
    <CourseLayout selectedTab="데이트 코스" onTabSelect={() => {}}>
        <View style={styles.headerContainer}>
            <View>
                <Text style={styles.title}>{courseTitle}</Text>
                <Text style={styles.date}>{courseStartDate} ~ {courseEndDate}</Text>
            </View>

            <View style={styles.rightHeaderGroup}>
                <TouchableOpacity style={styles.mapButton} onPress={toggleMapView}>
                <Text style={styles.mapButtonText}>{isMapVisible ? '지도 닫기' : '지도 보기'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowReportModal(true)}>
                <Image source={require('../../../assets/report.png')} style={styles.reportIcon} />
                </TouchableOpacity>
            </View>
        </View>

        <Animated.View style={[styles.mapContainer, { height: slideAnim }]}>
            {isMapVisible && (
                <NaverMapView
                    style={{ width: '100%', height: 250 }}
                    initialCamera={{
                    latitude: locations[0]?.latitude || 35.8344,
                    longitude: locations[0]?.longitude || 129.2043,
                    zoom: 10
                    }}
                    mapType="Basic"
                    isShowLocationButton={true}
                >
                {locations.map(loc => (
                <NaverMapMarkerOverlay
                key={loc.location_id}
                latitude={loc.latitude}
                longitude={loc.longitude}
                width={30}
                height={40}
                />
            ))}
            </NaverMapView>
        )}
        </Animated.View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item.location_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.locationItem}>
            <Text style={styles.locationName}>{item.location_name}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            {item.course_memo && <Text style={styles.courseMemo}>{item.course_memo}</Text>}
          </View>
        )}
      />

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.registerButton} onPress={onAddToFavorite}>
            <Text style={styles.registerButtonText}>즐겨찾기에 추가</Text>
        </TouchableOpacity>
      </View>

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onConfirm={handleReportSubmit}
      />

      <CourseScrapModal
        visible={isModalVisible}
        status={status}
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        scrapTargetName={scrapTargetName}
        onCreatePress={() => handleCreateNavigate(navigation)}
        onConfirmPress={() => handleScrap(courseId)}
        onClose={() => setIsModalVisible(false)}
      />
    </CourseLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#FF6F61' },
  date: { fontSize: 12, color: '#666' },
  reportIcon: { width: 20, height: 20, tintColor: '#666' },
  rightHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mapButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 4,
  },  
  mapButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  mapContainer: { width: '100%', height: 250, overflow: 'hidden', backgroundColor: 'white' },
  locationItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationName: { fontSize: 16, fontWeight: 'bold' },
  locationAddress: { fontSize: 12, color: '#666' },
  courseMemo: { fontSize: 12, color: '#888', fontStyle: 'italic' },
  bottomButtons: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  registerButton: {
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

export default OtherCourseDetail;
