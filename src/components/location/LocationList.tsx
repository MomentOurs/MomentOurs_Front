import React from 'react';
import { FlatList } from 'react-native';
import LocationItem from './LocationItem';
import { ResponseLocationMapVO } from '../../types/location';

interface LocationListProps {
  locations: ResponseLocationMapVO[];
  onItemPress?: (locationId: number) => void;
}

const LocationList: React.FC<LocationListProps> = ({ locations, onItemPress }) => {
  return (
    <FlatList
      data={locations}
      keyExtractor={(item) => item.locationId.toString()}
      renderItem={({ item }) => (
        <LocationItem item={item} onPress={onItemPress} />
      )}
    />
  );
};

export default LocationList;
