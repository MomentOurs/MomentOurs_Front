import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
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
      <View>
        <Text style={styles.name}>{item.locationName}</Text>
        <Text style={styles.description}>{item.description || '설명 없음'}</Text>
        <FlatList
          data={item.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri) => uri}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
        />
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
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  hours: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 10,
  },
});

export default LocationItem;
