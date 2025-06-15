import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { ResponseLocationMapVO } from '../../types/location';

interface LocationSearchResultProps {
  results: ResponseLocationMapVO[];
  onItemPress: (location: ResponseLocationMapVO) => void;
  onAddNewPlace?: (keyword: string) => void;
  searchKeyword?: string;
}

const LocationSearchResult: React.FC<LocationSearchResultProps> = ({
  results,
  onItemPress,
  onAddNewPlace,
  searchKeyword,
}) => {
  const renderItem = ({ item }: { item: ResponseLocationMapVO }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onItemPress(item)}
    >
      {item.images && item.images.length > 0 ? (
        <Image source={{ uri: item.images[0] }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.locationName}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            {item.isOpen ? '영업중' : '영업종료'}
          </Text>
          {item.closingTime && (
            <Text style={styles.metaText}>· {item.closingTime} 종료</Text>
          )}
          {item.rating && (
            <Text style={styles.metaText}>· ⭐ {item.rating}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
      {onAddNewPlace && searchKeyword && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewPlace(searchKeyword)}
        >
          <Text style={styles.addButtonText}>
            "{searchKeyword}" 장소 추가하기
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item.locationId.toString()}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF6F61',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LocationSearchResult; 