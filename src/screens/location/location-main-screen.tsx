import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import LocationMap from '../../components/location/LocationMap';
import LocationList from '../../components/location/LocationList';
import useLocationList from '../../hooks/useLocationList';

const LocationMainScreen = () => {
  const { locations, loading } = useLocationList();

  const handleItemPress = (id: number) => {
    console.log('장소 선택:', id); // TODO: navigation 등 연결
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LocationMap locations={locations} />
      <LocationList locations={locations} onItemPress={handleItemPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default LocationMainScreen;
