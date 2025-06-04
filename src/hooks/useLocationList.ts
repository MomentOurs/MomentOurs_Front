import { useEffect, useState } from 'react';
import { ResponseLocationMapVO } from '../types/location';

export default function useLocationList() {
  const [locations, setLocations] = useState<ResponseLocationMapVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 파라미터 값 적절히 설정 필요
    fetch(`http://localhost:8080/api/location/map?latitudeMin=35&latitudeMax=37&longitudeMin=126&longitudeMax=128`)
      .then(res => res.json())
      .then(data => setLocations(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { locations, loading };
}
