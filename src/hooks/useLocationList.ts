import { useEffect, useState } from 'react';
import { ResponseLocationMapVO } from '../types/location';

export default function useLocationList() {
  const [locations, setLocations] = useState<ResponseLocationMapVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/location/map?latitudeMin=37&latitudeMax=38&longitudeMin=126&longitudeMax=128`)
    .then(res => res.json())
    .then(data => {
      setLocations(data.data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  return { locations, loading };
}
