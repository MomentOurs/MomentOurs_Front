import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { ResponseLocationMapVO } from '../../types/location';

interface LocationMapProps {
  locations: ResponseLocationMapVO[];
}

const LocationMap: React.FC<LocationMapProps> = ({ locations }) => {
  const initialLat = locations[0]?.latitude ?? 37.5665;     // 서울 기준 fallback
  const initialLng = locations[0]?.longitude ?? 126.9780;

  return (
    <View style={styles.container}>
      <NaverMapView
        style={styles.map}
        initialCamera={{
          latitude: initialLat,
          longitude: initialLng,
          zoom: 13,
        }}
        mapType="Basic"
        isShowLocationButton
      >
        {locations.map((loc) => (
          <NaverMapMarkerOverlay
            key={loc.locationId}
            latitude={loc.latitude}
            longitude={loc.longitude}
            width={30}
            height={40}
          />
        ))}
      </NaverMapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: 250 },
  map: { flex: 1 },
});

export default LocationMap;
