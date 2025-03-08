import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CourseHomeScreen from '../../../pages/course/index';
// import CourseCreateScreen from './course-create';
import CourseFolderCreateScreen from './course-folder-create';
// import CourseDetailScreen from './course-detail';

export type CourseStackParamList = {
  CourseHome: { refresh?: boolean };
  CourseCreate: undefined;
  CourseFolderCreate: undefined;
  CourseDetail: { folderId: string };
};

const Stack = createStackNavigator<CourseStackParamList>();

const CourseNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="CourseHome">
      <Stack.Screen name="CourseHome" component={CourseHomeScreen} options={{ headerShown: false }} />
      {/* <Stack.Screen name="CourseCreate" component={CourseCreateScreen} options={{ title: '코스 만들기' }} /> */}
      <Stack.Screen name="CourseFolderCreate" component={CourseFolderCreateScreen} options={{ title: '폴더 만들기' }} />
      {/* <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: '폴더 상세' }} /> */}
    </Stack.Navigator>
  );
};

export default CourseNavigator;