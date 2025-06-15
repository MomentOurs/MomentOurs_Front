import { useState } from 'react';
import { getClusteredLocations } from '../api/location';

export interface ClusterMarker {
  latitude: number;
  longitude: number;
  count: number;
  locationId?: number;
  locationName?: string;
  momentCount?: number;
  image?: any;
  identifier: string;
}

export const useClusterMarkers = () => {
  const [clusters, setClusters] = useState<ClusterMarker[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchClusters = async (
    zoom: number,
    center: { latitude: number; longitude: number },
    bounds: { latitudeMin: number; latitudeMax: number; longitudeMin: number; longitudeMax: number }
  ) => {
    try {
      setLoading(true);
      const response = await getClusteredLocations({
        zoom,
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeMin: bounds.latitudeMin,
        latitudeMax: bounds.latitudeMax,
        longitudeMin: bounds.longitudeMin,
        longitudeMax: bounds.longitudeMax
      });
      const clustersWithImage = (response.data?.data ?? []).map(cluster => ({
        ...cluster,
        image: require('../../assets/marker-circle.png'),
        identifier: `${cluster.latitude},${cluster.longitude},${cluster.locationId ?? cluster.count}`,
        locationId: cluster.locationId,
      }));
      setClusters(clustersWithImage);
    } catch (e) {
      console.error('클러스터 조회 실패', e);
    } finally {
      setLoading(false);
    }
  };

  return { clusters, loading, fetchClusters };
};
