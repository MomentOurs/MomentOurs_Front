import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LocationSearchBar from '../../components/location/LocationSearchBar';
import LocationSearchResult from '../../components/location/LocationSearchResult';
import { ResponseLocationMapVO } from '../../types/location';

const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

const LocationSearchScreen = () => {
  const navigation = useNavigation<any>();
  const [searchResults, setSearchResults] = useState<ResponseLocationMapVO[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const route = useRoute<any>();

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    try {
      const response = await fetch(`${baseURL}/api/location/search?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (e) {
      setSearchResults([]);
    }
  };

  const handleResultPress = (item: ResponseLocationMapVO) => {
    navigation.navigate('LocationMain', { location: item });
  };

  return (
    <View style={styles.container}>
      <LocationSearchBar
        onSearch={handleSearch}
        onFocus={() => {}}
        autoFocus
      />
      <LocationSearchResult
        results={searchResults}
        onItemPress={handleResultPress}
        searchKeyword={searchKeyword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
});

export default LocationSearchScreen;