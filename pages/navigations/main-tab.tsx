import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../calendar';
import QuestionsScreen from '../questions/index';
import HomeScreen from '../home';
import CourseNavigator from '../../src/screens/course/course-navigation';
// import MapScreen from '../location';
import HomeStackNavigator from '../../src/screens/home/navigator/home-stack-navigator';
import MapStackNavigator from '../../src/screens/location/MapStackNavigator';

const Tab = createBottomTabNavigator();

const MainTabsNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="랜덤질문" component={QuestionsScreen} options={{ headerShown: false }}/>
            <Tab.Screen name="Map" component={MapStackNavigator} options={{ headerShown: false }}/>
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Course" component={CourseNavigator} options={{ headerShown: false }}/> 
        </Tab.Navigator>
    );
};

export default MainTabsNavigator;
