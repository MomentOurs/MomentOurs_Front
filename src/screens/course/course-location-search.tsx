import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CourseLayout from './course-layout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET } from '@env';

type Location = {
    locationName: string;
    address: string;
    latitude?: number;
    longitude?: number;
    description?: string;
};

const dummyLocations: Location[] = [
    { locationName: '경주박물관', address: '경상북도 경주시 일정로', description: '신라 문화재를 전시한 박물관' },
    { locationName: '대릉원', address: '경상북도 경주시 황남동', description: '신라 왕족의 무덤이 모여있는 곳' },
    { locationName: '석굴암', address: '경상북도 경주시 불국동', description: '유네스코 세계문화유산' },
    { locationName: '첨성대', address: '경상북도 경주시 인왕동', description: '신라 시대의 대표적인 천문대' },
];

const CourseLocationSearch = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [dbSuggestions, setDbSuggestions] = useState<Location[]>([]);
    const [naverResults, setNaverResults] = useState<Location[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [recentSearches, setRecentSearches] = useState<Location[]>([]);
    const [searchCache, setSearchCache] = useState<{ [key: string]: Location[] }>({});
    const [loading, setLoading] = useState(false);
    const [recommendedLocations, setRecommendedLocations] = useState<Location[]>(dummyLocations);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    const loadRecentSearches = async () => {
        try {
            const data = await AsyncStorage.getItem('recentSearches');
            if (data) setRecentSearches(JSON.parse(data));
        } catch (err) {
            console.error('최근 검색 불러오기 실패:', err);
        }
    };

    const saveRecentSearch = async (location: Location) => {
        try {
            const updated = [location, ...recentSearches.filter(l => l.locationName !== location.locationName)];
            const sliced = updated.slice(0, 5);
            setRecentSearches(sliced);
            await AsyncStorage.setItem('recentSearches', JSON.stringify(sliced));
        } catch (err) {
            console.error('최근 검색 저장 실패:', err);
        }
    };

    const removeRecentSearch = async (locationName: string) => {
        const updated = recentSearches.filter(l => l.locationName !== locationName);
        setRecentSearches(updated);
        await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const fetchNaverPlaces = async (query: string) => {
        try {
            const response = await fetch(`https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${query}`, {
                method: 'GET',
                headers: {
                    'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID,
                    'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET
                }
            });

            const data = await response.json();
            if (data.addresses.length > 0) {
                return data.addresses.map((addr: any) => ({
                    locationName: addr.roadAddress || addr.jibunAddress,
                    address: addr.roadAddress || addr.jibunAddress,
                    latitude: parseFloat(addr.y),
                    longitude: parseFloat(addr.x),
                }));
            }
        } catch (error) {
            console.error("네이버 지도 API 호출 실패:", error);
        }
        return [];
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.length === 0) {
            setFilteredLocations([]);
            return;
        }

        const filtered = dummyLocations.filter(location =>
            location.locationName.includes(text) || location.address.includes(text)
        );

        setFilteredLocations(filtered);
    };

    const highlightMatch = (text: string, keyword: string): React.ReactNode[] => {
        if (!keyword) return [text];
          
        const regex = new RegExp(`(${keyword})`, 'gi');
        const parts = text.split(regex);
          
        return parts.map((part, index) =>
            part.toLowerCase() === keyword.toLowerCase() ? (
                <Text key={index} style={styles.highlightText}>{part}</Text>
            ) : (
                <Text key={index}>{part}</Text>
            )
        );
    };

    const handleSearchConfirm = async () => {
        if (!searchQuery) return;

        const filtered = dummyLocations.filter(location =>
            location.locationName.includes(searchQuery) || location.address.includes(searchQuery)
        );

        if (filtered.length > 0) {
            setFilteredLocations(filtered);
            return;
        }

        if (searchCache[searchQuery]) {
            setFilteredLocations(searchCache[searchQuery]);
            return;
        }

        const naverResults = await fetchNaverPlaces(searchQuery);
        setFilteredLocations(naverResults);

        setSearchCache(prevCache => ({
            ...prevCache,
            [searchQuery]: naverResults
        }));

        /*
        if (!searchQuery) return;

        // 1️⃣ 먼저 DB에 검색 요청
        const response = await fetch(`http://localhost:8080/api/location/search?query=${searchQuery}`);

        const data = await response.json();
        if (data.length > 0) {
            setFilteredLocations(data); // DB에서 찾은 결과를 보여줌
            return;
        }

        // 2️⃣ DB에 없으면 네이버 지도 API 요청
        const naverResults = await fetchNaverPlaces(searchQuery);
        setFilteredLocations(naverResults);
        
        try {
            const response = await fetch('http://localhost:8080/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locationName: naverResults[0]?.locationName,
                    address: naverResults[0]?.address,
                    latitude: naverResults[0]?.latitude,
                    longitude: naverResults[0]?.longitude,
                    locationStatus: "UNCHANGED"
                })
            });

            if (response.ok) {
                console.log("장소 정보가 DB에 저장되었습니다.");
            } else {
                console.error("장소 저장 실패");
            }
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
        */
    };

    return (
        <CourseLayout>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="관광지/맛집/숙소 검색"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={handleSearchConfirm}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                </TouchableOpacity>
            </View>

            {searchQuery.length > 0 ? (
                <FlatList
                    data={filteredLocations}
                    keyExtractor={(item) => item.locationName}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.resultItem} onPress={() => saveRecentSearch(item)}>
                        <View style={styles.resultTextContainer}>
                        <Text style={styles.resultTitle}>{highlightMatch(item.locationName, searchQuery)}</Text>
                        <Text style={styles.resultDescription}>{highlightMatch(item.address, searchQuery)}</Text>
                        </View>
                    </TouchableOpacity>
                    )}
                />
            ) : (
                <>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>추천 장소</Text>
                    {recommendedLocations.map((item, index) => (
                        <View key={index} style={styles.recommendItem}>
                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultTitle}>{item.locationName}</Text>
                                <Text style={styles.resultDescription}>{item.address}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPress={() => {
                                    saveRecentSearch(item);
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.selectButtonText}>선택</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>최근 검색 장소</Text>
                    {recentSearches.map((item, index) => (
                        <View key={index} style={styles.recommendItem}>
                            <View style={styles.resultTextContainer}>
                                <Text style={styles.resultTitle}>{item.locationName}</Text>
                                <Text style={styles.resultDescription}>{item.address}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.selectButton}
                                    onPress={() => {
                                        saveRecentSearch(item);
                                        navigation.goBack();
                                    }}
                                >
                                    <Text style={styles.selectButtonText}>선택</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeRecentSearch(item.locationName)} style={{ marginLeft: 8 }}>
                                    <MaterialIcons name="close" size={18} color="#ccc" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
                </>
            )}
        </CourseLayout>
    );
};

const styles = StyleSheet.create({
    searchContainer: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    searchInput: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ddd' },
    searchIcon: { marginLeft: 8 },
    resultItem: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    resultTextContainer: { flex: 1 },
    resultTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, },
    resultDescription: { fontSize: 12, color: '#777' },
    selectButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 5, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ddd' },
    selectButtonText: { fontSize: 12, color: '#999' },
    sectionContainer: {
        paddingHorizontal: 14,
        paddingVertical: 12,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
      },
      recommendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
      },
      highlightText: {
        color: '#FF6F61',
        fontWeight: 'bold',
      },      
});

export default CourseLocationSearch;
