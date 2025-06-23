import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Screens
import LocationMainScreen from '../screens/location/location-main-screen';
import LocationSearchScreen from '../screens/location/location-search-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LocationMain"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="LocationMain" component={LocationMainScreen} />
        <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 