import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CourseHomeScreen from '../../../pages/course/index';
import CourseCreateScreen from './course-create';
import CourseFolderDetail from './course-folder-detail';
import CourseDetailScreen from './course-detail';
import CourseLocationSearch from './course-location-search';
import DateCourseTab from '../../../pages/course/datecourse-tab';
import CourseScreen from '../../../pages/course/index';
import FavoriteCourseTab from '../../../pages/course/favorite-course-tab';
import CourseFolderSelectScreen from './course-folder-select';
import OtherCourseDetail from './other-course-detail';
import FavoriteFolderCreate from './favorite-folder-create';

export type CourseStackParamList = {
  CourseScreen: { refresh?: boolean; goToCreate?: boolean; initialTab?: '내 코스' | '데이트 코스' | '즐겨찾기' };
  CourseCreate: { folderId: number; folderTitle: string };
  CourseFolderSelect: undefined;
  CourseFolderDetail: { folderId: number; folderTitle: string; folderDescription: string };
  CourseDetail: { courseId: number; courseTitle: string; courseType: 'DATE' | 'TRIP'; courseStartDate: string; courseEndDate: string };
  CourseLocationSearch: undefined;
  DateCourseTab: undefined;
  FavoriteCourseTab: { refreshFavorite?: boolean };
  OtherCourseDetail: { courseId: number; courseTitle: string; courseType: 'DATE' | 'TRIP'; courseStartDate: string; courseEndDate: string };
  FavoriteFolderCreate: undefined;
};

const Stack = createStackNavigator<CourseStackParamList>();

const CourseNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CourseScreen">
      <Stack.Screen name="CourseScreen" component={CourseScreen} options={{ title: '코스', animation: 'none' }}/> 
      <Stack.Screen name="DateCourseTab" component={DateCourseTab} options={{ title: '데이트 코스', animation: 'none' }} />
      <Stack.Screen name="FavoriteCourseTab" component={FavoriteCourseTab} options={{ title: '즐겨찾기', animation: 'none' }} />
      <Stack.Screen name="CourseCreate" component={CourseCreateScreen} options={{ title: '코스 만들기',  }} />
      <Stack.Screen name="CourseFolderSelect" component={CourseFolderSelectScreen} options={{ title: '폴더 선택' }} />
      <Stack.Screen name="CourseFolderDetail" component={CourseFolderDetail} options={{ animation: 'none' }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ animation: 'none' }} />
      <Stack.Screen name="CourseLocationSearch" component={CourseLocationSearch} options={{ animation: 'none' }} />
      <Stack.Screen name="OtherCourseDetail" component={OtherCourseDetail} options={{ animation: 'none' }}/>
      <Stack.Screen name="FavoriteFolderCreate" component={FavoriteFolderCreate} options={{ animation: 'none' }}/>
    </Stack.Navigator>
  );
};

export default CourseNavigator;