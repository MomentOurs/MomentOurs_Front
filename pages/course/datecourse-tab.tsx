import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CourseLayout from '../../src/screens/course/course-layout';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../../src/screens/course/course-navigation';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

type Course = {
  id: number;
  title: string;
  courseType: 'DATE' | 'TRIP';
  likes: number;
  views: number;
};

type ResponseDateCourseListVO = {
  course_id: number;
  course_title: string;
  course_type: 'DATE' | 'TRIP';
  course_like: number;
  course_view: number;
  course_start_date: string;
  course_end_date: string;
  member_id: number;
};

const DateCourseTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'likes' | 'views'>('likes');
  const [courses, setCourses] = useState<Course[]>([]);
  const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();

  const handleSearchConfirm = () => {
    if (!searchQuery.trim()) {
      return;
    }
  
    const filtered = courses.filter(course =>
      course.title.includes(searchQuery.trim())
    );
  
    setCourses(filtered);
  };  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // const token = await SecureStore.getItemAsync('accessToken');
        // const token = '(로그인 후 액세스 토큰 입력)';
  
        const response = await fetch(`http://localhost:8080/api/course?sortBy=${sortBy}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('서버 응답 오류');
        }
  
        const data: ResponseDateCourseListVO[] = await response.json();

        const mapped = data.map((item) => ({
          id: item.course_id,
          title: item.course_title,
          courseType: item.course_type,
          likes: item.course_like,
          views: item.course_view,
        }));
  
        setCourses(mapped);
      } catch (err) {
        console.error('데이트 코스 불러오기 실패:', err);
      }
    };
  
    fetchCourses();
  }, [sortBy]);
  

  const sortedCourses = [...courses].sort((a, b) => b[sortBy] - a[sortBy]);
  
  const renderCourseItem = ({ item }: { item: Course }) => {
    const formattedViews = item.views > 999 ? '999+' : item.views.toString();
    const formattedLikes = item.likes > 999 ? '999+' : item.likes.toString();
  
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('OtherCourseDetail', {
            courseId: item.id,
            courseTitle: item.title,
            courseType: item.courseType,
            courseStartDate: '2025-04-01', // TODO: 실제 데이터로 바꾸기
            courseEndDate: '2025-04-01',
          })
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.titleRow}>
            <View style={styles.leftGroup}>
              <View style={[styles.badge, item.courseType === 'TRIP' ? styles.tripBadge : styles.dateBadge]}>
                <Text style={[styles.badgeText, item.courseType === 'TRIP' ? styles.tripText : styles.dateText]}>
                  {item.courseType === 'TRIP' ? '여행' : '데이트'}
                </Text>
              </View>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
            </View>
  
            {sortBy === 'likes' ? (
              <View style={styles.likesRow}>
                <Text style={styles.likesText}>{formattedLikes}</Text>
                <Image source={require('../../assets/good.png')} style={styles.likeIcon} />
              </View>
            ) : (
              <View style={styles.viewsRow}>
                <Text style={styles.viewsText}>{formattedViews}</Text>
                <Image source={require('../../assets/eye.png')} style={styles.viewIcon} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };  

  return (
    <CourseLayout
      selectedTab="데이트 코스"
      onTabSelect={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="관광지/맛집/숙소 검색"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={handleSearchConfirm}
          />
          <TouchableOpacity onPress={handleSearchConfirm}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {searchQuery.length === 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>오늘의 추천 코스</Text>
              <View style={styles.sortButtons}>
                <TouchableOpacity onPress={() => setSortBy('likes')}>
                  <Text style={[styles.sortText, sortBy === 'likes' && styles.activeSort]}>좋아요순</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSortBy('views')}>
                  <Text style={[styles.sortText, sortBy === 'views' && styles.activeSort]}>조회순</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={sortedCourses}
              renderItem={renderCourseItem}
              keyExtractor={(item) => item.id.toString()}
            />
          </>
        )}
      </View>
    </CourseLayout>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ddd' },
  searchIcon: { marginLeft: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
    paddingTop : 8
  },
  
  sortButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  sortText: { fontSize: 12, color: '#aaa', marginLeft: 10 },
  activeSort: { color: '#FF6F61', fontWeight: 'bold' },
  itemContainer: {
    marginBottom: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },  
  courseInfo: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 25,
  },
  
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: 6,
  },
  
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    maxWidth: 200,
    flexShrink: 1,
  },
  badge: {
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  
  tripBadge: {
    backgroundColor: '#E8F1FF',
  },
  
  dateBadge: {
    backgroundColor: '#FFF0F0',
  },

  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  tripText: {
    color: '#3B82F6',
  },
  
  dateText: {
    color: '#FF6F61',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginLeft: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  likeIcon: {
    width: 14,
    height: 14,
  },
  
  likesText: {
    fontSize: 12,
    color: '#888',
  },

  viewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  viewIcon: {
    width: 14,
    height: 14,
  },
  
  viewsText: {
    fontSize: 12,
    color: '#888',
  },  
  
});

export default DateCourseTab;