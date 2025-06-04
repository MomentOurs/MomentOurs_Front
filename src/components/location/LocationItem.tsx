import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ResponseLocationMapVO } from '../../types/location';

interface LocationItemProps {
  item: ResponseLocationMapVO;
  onPress?: (locationId: number) => void;
}

const LocationItem: React.FC<LocationItemProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress?.(item.locationId)}
    >
      <View>
        <Text style={styles.name}>{item.locationName}</Text>
        <Text style={styles.address}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  address: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
});

export default LocationItem;
