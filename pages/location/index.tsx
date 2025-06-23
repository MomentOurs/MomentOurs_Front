import React from 'react';
import { View, StyleSheet } from 'react-native';
import LocationMainContainer from '../../src/screens/location/location-main-screen';

const LocationScreen = () => {
  return (
    <View style={styles.page}>
      <LocationMainContainer />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
});

export default LocationScreen;
