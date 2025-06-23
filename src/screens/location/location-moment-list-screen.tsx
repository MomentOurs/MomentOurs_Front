import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import LocationMomentListView from '../../components/location/LocationMomentListView';

const LocationMomentListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params as { locationId: number };

  return (
    <LocationMomentListView
      locationId={locationId}
      onBack={() => navigation.goBack()}
    />
  );
};

export default LocationMomentListScreen;
