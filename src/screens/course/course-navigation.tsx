import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CourseHomeScreen from '../../../pages/course/index';
import CourseCreateScreen from './course-create';
import CourseFolderCreateScreen from './course-folder-create';
import CourseFolderDetail from './course-folder-detail';
import CourseDetailScreen from './course-detail';
import CourseLocationSearch from './course-location-search';

export type CourseStackParamList = {
    CourseScreen: { refresh?: boolean };
    CourseCreate: undefined;
    CourseFolderCreate: undefined;
    CourseFolderDetail: { folderId: number; folderTitle: string; folderDescription: string };
    CourseDetail: { courseId: number; courseTitle: string; courseType: 'DATE' | 'TRIP'; courseStartDate: string; courseEndDate: string };
    CourseLocationSearch: undefined;
};

const Stack = createStackNavigator<CourseStackParamList>();

const CourseNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CourseScreen">
      <Stack.Screen name="CourseScreen" component={CourseHomeScreen} options={{ title: '코스' }}/> 
      <Stack.Screen name="CourseCreate" component={CourseCreateScreen} options={{ title: '코스 만들기' }} />
      <Stack.Screen name="CourseFolderCreate" component={CourseFolderCreateScreen} options={{ title: '폴더 만들기' }} />
      <Stack.Screen name="CourseFolderDetail" component={CourseFolderDetail} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="CourseLocationSearch" component={CourseLocationSearch} />
    </Stack.Navigator>
  );
};

export default CourseNavigator;