import axios from 'axios';
import { ClusterMarker } from '../hooks/useClusterMarkers';
import { Platform } from 'react-native';

const baseURL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080'
    : 'http://localhost:8080';

const api = axios.create({ baseURL });

interface ClusterResponse {
  data: ClusterMarker[];
  success: boolean;
  error: string | null;
}

export const getClusteredLocations = async (params: {
  zoom: number;
  latitude: number;
  longitude: number;
  latitudeMin: number; 
  latitudeMax: number; 
  longitudeMin: number; 
  longitudeMax: number
}) => {
  return api.get<ClusterResponse>('/api/location/clusters', {
    params,
  });
};
