import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import CourseLayout from './course-layout';
import ReportModal from '../../components/modals/course/ReportModal';
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
  const { courseId, courseTitle, courseType, courseStartDate, courseEndDate } = route.params as RouteParams;
  
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;


  useEffect(() => {
    // TODO: 실제 courseId 기반 장소 조회 API 호출
    setLocations([
        {
          courseLocationId: 1,
          courseId: courseId,
          locationId: 1,
          locationName: '황리단길',
          address: '경상북도 경주시 황남동 포석로 일대',
          latitude: 35.8344,
          longitude: 129.2043,
          sequence: 1,
          courseMemo: '핫플레이스 카페 및 맛집 밀집 지역',
        },
        {
          courseLocationId: 2,
          courseId: courseId,
          locationId: 2,
          locationName: '포석정지',
          address: '경상북도 경주시 배동 남산순환로 816',
          latitude: 35.7861,
          longitude: 129.2914,
          sequence: 2,
          courseMemo: '신라 왕궁의 역사적인 장소',
        }
    ]);
  }, [courseId]);

  const handleReportSubmit = (reason) => {
    setShowReportModal(false);
    console.log('신고 사유:', reason);
    // TODO: 신고 API 호출
  };

  const toggleMapView = async () => {
    if (!isMapVisible) {
      setIsMapVisible(true);
      setLoading(true);
  
      // TODO: 네이버 API 실제 호출 시 필요
      // await fetchNaverMapData();
  
      Animated.timing(slideAnim, {
        toValue: 250, // 보일 높이
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
                key={loc.courseLocationId}
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
        keyExtractor={(item) => item.courseLocationId.toString()}
        renderItem={({ item }) => (
          <View style={styles.locationItem}>
            <Text style={styles.locationName}>{item.locationName}</Text>
            <Text style={styles.locationAddress}>{item.address}</Text>
            {item.courseMemo && <Text style={styles.courseMemo}>{item.courseMemo}</Text>}
          </View>
        )}
      />

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.registerButton} onPress={() => console.log('내 코스에 추가')}>
          <Text style={styles.registerButtonText}>즐겨찾기에 추가</Text>
        </TouchableOpacity>
      </View>

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onConfirm={handleReportSubmit}
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
