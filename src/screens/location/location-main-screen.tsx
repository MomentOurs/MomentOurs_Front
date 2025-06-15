import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import LocationMap from '../../components/location/LocationMap';
import { ResponseLocationMapVO } from '../../types/location';
import { useClusterMarkers } from '../../hooks/useClusterMarkers';
import * as Location from 'expo-location';
import LocationSearchBar from '../../components/location/LocationSearchBar';
import LocationSearchResult from '../../components/location/LocationSearchResult';
import LocationDetailSheet from '../../components/location/LocationDetailSheet';

const LocationMainScreen = () => {
  const [selectedLatLng, setSelectedLatLng] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationList, setLocationList] = useState<ResponseLocationMapVO[]>([]);
  const [center, setCenter] = useState({ latitude: 37.5665, longitude: 126.9780 });
  const [camera, setCamera] = useState({ latitude: 37.5665, longitude: 126.9780, zoom: 13 });

  const { clusters, loading, fetchClusters } = useClusterMarkers();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showSearchButton, setShowSearchButton] = useState(false);
  const navigation = useNavigation<any>();
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showNoResult, setShowNoResult] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ResponseLocationMapVO[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const route = useRoute<any>();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

  const mapRef = useRef(null);
  const ignoreCameraChangeRef = useRef(false);
  const [highlightMarker, setHighlightMarker] = useState<ResponseLocationMapVO | null>(null);

  const moveCameraTo = (latitude: number, longitude: number, zoom = 15) => {
    console.log('[moveCameraTo 호출]', { latitude, longitude, zoom });

    ignoreCameraChangeRef.current = true;
    setCamera({ latitude, longitude, zoom });
    setCenter({ latitude, longitude });

    setTimeout(() => {
      ignoreCameraChangeRef.current = false;
    }, 500);
  };

  useEffect(() => {
    const initLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      if (!route.params?.location) {
        moveCameraTo(latitude, longitude, 13);

        await fetchClusters(13, { latitude, longitude }, {
          latitudeMin: latitude - 0.05,
          latitudeMax: latitude + 0.05,
          longitudeMin: longitude - 0.05,
          longitudeMax: longitude + 0.05
        });
      }
    };

    initLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const loc = route.params?.location;
      if (loc) {
        moveCameraTo(loc.latitude, loc.longitude, 15);

        fetchLocationDetail(loc.locationId).then((detail) => {
          if (detail) {
            setHighlightMarker(detail);
            setSelectedLocation(detail);
          }
        });

        navigation.setParams({ location: undefined });
      }
    }, [route.params?.location])
  );

  const fetchLocationDetail = async (locationId: number) => {
    try {
      const response = await fetch(`${baseURL}/api/location/${locationId}/detail`);
      const data = await response.json();
      return data.data;
    } catch (e) {
      console.error('[API 에러]', e);
      return null;
    }
  };

  const fetchNaverDetail = async (query: string) => {
    try {
      const response = await fetch(`${baseURL}/api/location/naver-detail?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.data;
    } catch (e) {
      return null;
    }
  };

  const handleClusterClick = async (latitude: number, longitude: number) => {
    setSelectedLatLng({ latitude, longitude });
    const res = await fetch(`${baseURL}/api/location/cluster/locations?latitude=${latitude}&longitude=${longitude}&zoom=${camera.zoom}`);
    const data = await res.json();
    const list = data.data;
    setLocationList(list);

    if (list.length === 1) {
      const detail = await fetchLocationDetail(list[0].locationId);
      if (detail) setSelectedLocation(detail);
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  const handleMarkerPress = async (locationId: number) => {
    const detail = await fetchLocationDetail(locationId);
    if (detail) {
      setSelectedLocation(detail);
    }
  };

  const handleSearchBarPress = () => {
    navigation.navigate('LocationSearch', {
      onSelect: async (item: any) => {
        let detail;
        if (item.locationId) {
          detail = await fetchLocationDetail(item.locationId);
        } else {
          detail = await fetchNaverDetail(item.locationName);
        }
        if (detail) {
          moveCameraTo(detail.latitude, detail.longitude, 15);
          setHighlightMarker(detail);
          setSelectedLocation(detail);
        }
      }
    });
  };

  const handleViewMoments = () => {
    if (!selectedLocation?.locationId) return;
    navigation.navigate('LocationMomentList', {
      locationId: selectedLocation.locationId,
    });
  };

  const fetchClustersWithLog = async (zoom: number, center: { latitude: number; longitude: number }, bounds: { latitudeMin: number; latitudeMax: number; longitudeMin: number; longitudeMax: number }) => {
    await fetchClusters(zoom, center, bounds);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarOverlay}>
        <TouchableOpacity activeOpacity={0.9} onPress={handleSearchBarPress} style={{ width: '100%' }}>
          <LocationSearchBar
            onSearch={() => {}}
            onFocus={handleSearchBarPress}
          />
        </TouchableOpacity>
        {showSearchButton && (
          <TouchableOpacity
            style={styles.searchButtonOverlay}
            onPress={async () => {
              const { latitude, longitude, zoom } = camera;
              const bounds = {
                latitudeMin: latitude - 0.05,
                latitudeMax: latitude + 0.05,
                longitudeMin: longitude - 0.05,
                longitudeMax: longitude + 0.05,
              };
              await fetchClustersWithLog(zoom, { latitude, longitude }, bounds);
              setLocationList([]);
              setModalVisible(false);
              setShowSearchButton(false);
              setSearchPerformed(true);
              if (clusters.length === 0) {
                setShowNoResult(true);
                setTimeout(() => setShowNoResult(false), 2000);
              }
            }}
          >
            <Text style={styles.searchButtonText}>여기서 검색하기</Text>
          </TouchableOpacity>
        )}
      </View>

      <LocationMap
        clusters={clusters}
        onClusterClick={handleClusterClick}
        onCameraChange={(latitude, longitude) => {
          if (ignoreCameraChangeRef.current) {
            console.log('[onCameraChange 무시됨]');
            return;
          }
          setCamera((prev) => ({ ...prev, latitude, longitude }));
          setCenter({ latitude, longitude });
          setShowSearchButton(true);
        }}
        camera={camera}
        center={center}
        zoom={camera.zoom}
        onClusterMarkerPress={undefined}
        onMarkerPress={handleMarkerPress}
        mapRef={mapRef}
        logCamera={camera}
        highlightMarker={highlightMarker}
      />

      <View style={styles.zoomContainer}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => setCamera((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 1, 18) }))}
        >
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => setCamera((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 1, 3) }))}
        >
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>

      <LocationDetailSheet
        visible={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        location={selectedLocation}
        onViewMoments={handleViewMoments}
        onWriteMoment={() => {
          console.log('[추억 작성 클릭]', selectedLocation?.locationId);
          // TODO: 추억 작성 화면으로 이동
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarOverlay: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  searchButtonOverlay: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  zoomContainer: {
    position: 'absolute',
    right: 13,
    top: '44%',
    zIndex: 10,
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontSize: 18,
    color: '#333',
  },
  centeredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    zIndex: 100,
  },
  noticeBox: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    zIndex: 20,
  },
  noticeText: {
    fontSize: 12,
    color: '#444',
  },
});

export default LocationMainScreen;
