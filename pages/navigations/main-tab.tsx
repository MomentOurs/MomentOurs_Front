import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CalendarScreen from '../calendar';
import QuestionsScreen from '../questions';
import HomeScreen from '../home';
import CourseNavigator from '../../src/screens/course/course-navigation';
import MapScreen from '../map';
import HomeStackNavigator from '../home/home-stack-navigator';

const Tab = createBottomTabNavigator();

const MainTabsNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Questions" component={QuestionsScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Calendar" component={CalendarScreen} />
            <Tab.Screen name="Course" component={CourseNavigator} options={{ headerShown: false }}/> 
        </Tab.Navigator>
    )
}

export default MainTabsNavigator;