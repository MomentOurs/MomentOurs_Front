import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../calendar';
import QuestionsScreen from '../questions';
import HomeScreen from '../home';
import CourseScreen from '../course';
import MapScreen from '../map';

const Tab = createBottomTabNavigator();

// 메인 네비게이션 바
const MainTabsNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Questions" component={QuestionsScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Course" component={CourseScreen} />
        </Tab.Navigator>
    )
}

export default MainTabsNavigator;