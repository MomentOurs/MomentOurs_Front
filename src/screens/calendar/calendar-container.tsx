import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CalendarMainPage from './calendar-main-page';
import AddSchedulePage from './add-schedule-page';
import { NavigationContainer } from '@react-navigation/native';

export type CalendarStackParamList = {
    Main: undefined;
    Add: {
        editMode?: boolean;
        infos?: {
            title: string;
            detail: string;
        };
        planId: number;
    };
};

const Stack = createStackNavigator<CalendarStackParamList>();

const CalendarContainer = () => {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={CalendarMainPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Add"
                    component={AddSchedulePage}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </View>
    );
}

export default CalendarContainer;