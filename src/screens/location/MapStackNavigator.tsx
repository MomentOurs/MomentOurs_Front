import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationMainScreen from './location-main-screen';
import LocationSearchScreen from './location-search-screen';
import LocationMomentListScreen from './location-moment-list-screen';
import MomentCreateScreen from '../moment/moment-create-screen';
import MomentDetailScreen from '..//moment/moment-detail-screen';
// 필요시 LocationDetailScreen import
// import LocationDetailScreen from './location-detail-screen';

const Stack = createNativeStackNavigator();

const MapStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LocationMain" component={LocationMainScreen} />
      <Stack.Screen name="LocationSearch" component={LocationSearchScreen} />
      <Stack.Screen name="LocationMomentList" component={LocationMomentListScreen} />
      <Stack.Screen name="MomentCreate" component={MomentCreateScreen} /> 
      <Stack.Screen name="MomentDetailScreen" component={MomentDetailScreen}/>
      {/* <Stack.Screen name="LocationDetail" component={LocationDetailScreen} /> */}
    </Stack.Navigator>
  );
};

export default MapStackNavigator; 