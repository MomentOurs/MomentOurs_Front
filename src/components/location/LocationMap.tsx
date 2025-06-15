import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from '@mj-studio/react-native-naver-map';
import type { ClusterMarker } from '../../hooks/useClusterMarkers';
import { ResponseLocationMapVO } from '../../types/location';

interface LocationMapProps {
  clusters: ClusterMarker[];
  onClusterClick: (latitude: number, longitude: number) => void;
  onCameraChange?: (latitude: number, longitude: number) => void;
  center: { latitude: number; longitude: number };
  camera: { latitude: number; longitude: number; zoom: number };
  zoom: number;
  onClusterMarkerPress?: (identifier: string) => void;
  onMarkerPress?: (locationId: number) => void;
  mapRef: any;
  highlightMarker?: ResponseLocationMapVO | null;
}

const LocationMap: React.FC<LocationMapProps> = ({
  clusters,
  onClusterClick,
  onCameraChange,
  camera,
  zoom,
  onClusterMarkerPress,
  onMarkerPress,
  mapRef,
  highlightMarker
}) => {
  const prevCamera = useRef<{ latitude: number; longitude: number; zoom: number } | null>(null);

  useEffect(() => {
    if (!mapRef?.current) {
      console.warn('[LocationMap] mapRef.current가 null입니다.');
      return;
    }

    console.log('[LocationMap - moveCamera 호출]', camera);

    mapRef.current.moveCamera?.({
      latitude: camera.latitude,
      longitude: camera.longitude,
      zoom: camera.zoom,
    });
    prevCamera.current = camera;
  }, [camera]);

  const mergedMarkers: ClusterMarker[] = clusters.concat(
    highlightMarker
      ? [{
          latitude: highlightMarker.latitude,
          longitude: highlightMarker.longitude,
          count: 1,
          locationId: highlightMarker.locationId,
          locationName: highlightMarker.locationName,
          momentCount: highlightMarker.momentCount ?? 0,
          image: require('../../../assets/marker-circle.png'),
          identifier: `highlight-${highlightMarker.locationId}-${highlightMarker.latitude}`,
        }]
      : []
  );

  useEffect(() => {
    console.log('[LocationMap - highlightMarker 변경됨]', highlightMarker);
  }, [highlightMarker]);

  useEffect(() => {
    console.log('[mergedMarkers]', mergedMarkers);
  }, [clusters, highlightMarker]);

  useEffect(() => {
    console.log('[highlightMarker]', highlightMarker);
  }, [highlightMarker]);

  return (
    <View style={styles.container}>
      <NaverMapView
        ref={mapRef}
        style={styles.map}
        camera={camera}
        mapType="Basic"
        isShowLocationButton
        onCameraChanged={({ latitude, longitude }) => {
          onCameraChange?.(latitude, longitude);
        }}
        isShowZoomControls={false}
        clusters={[
          {
            markers: mergedMarkers,
            width: 40,
            height: 40,
          },
        ]}
        onTapClusterLeaf={({ markerIdentifier }) => {
          const marker = mergedMarkers.find(m => m.identifier === markerIdentifier);
          if (!marker) return;
          if (marker.count === 1 && marker.locationId) {
            onMarkerPress?.(marker.locationId);
          } else {
            onClusterMarkerPress?.(markerIdentifier);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', flex: 1 },
  map: { flex: 1 },
});

export default LocationMap;
