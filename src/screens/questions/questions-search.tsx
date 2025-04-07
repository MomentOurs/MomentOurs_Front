import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getRandomQuestionList } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    RandomQuestions: { userQuesId: number };
};

const STORAGE_KEY = 'recent_keywords';
const AUTO_SAVE_KEY = 'recent_auto_save';

const QuestionsSearchScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
    const [isAutoSave, setIsAutoSave] = useState(true);

    useEffect(() => {
        loadRecentKeywords();
        loadAutoSaveSetting();
    }, []);

    const loadRecentKeywords = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) setRecentKeywords(JSON.parse(stored));
        } catch (e) {
            console.error('❌ 최근 검색어 불러오기 실패:', e);
        }
    };

    const loadAutoSaveSetting = async () => {
        try {
            const stored = await AsyncStorage.getItem(AUTO_SAVE_KEY);
            if (stored !== null) setIsAutoSave(stored === 'true');
        } catch (e) {
            console.error('❌ 자동저장 상태 불러오기 실패:', e);
        }
    };

    const toggleAutoSave = async () => {
        try {
            const newValue = !isAutoSave;
            setIsAutoSave(newValue);
            await AsyncStorage.setItem(AUTO_SAVE_KEY, String(newValue));
        } catch (e) {
            console.error('❌ 자동저장 설정 저장 실패:', e);
        }
    };

    const saveRecentKeyword = async (keyword: string) => {
        if (!isAutoSave) return;
        try {
            let updated = [keyword, ...recentKeywords.filter(k => k !== keyword)];
            if (updated.length > 10) updated = updated.slice(0, 10);
            setRecentKeywords(updated);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.error('❌ 최근 검색어 저장 실패:', e);
        }
    };

    const clearRecentKeywords = async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setRecentKeywords([]);
    };

    const handleSearch = async (customKeyword?: string) => {
        const keyword = customKeyword ?? searchText.trim();
        if (!keyword) return;

        setSearchText(keyword);
        setLoading(true);
        try {
            const res = await getRandomQuestionList(undefined, 20, keyword);
            const list = res.data?.list || [];
            setSearchResults(list);
            setShowResults(true);
            await saveRecentKeyword(keyword);
            Keyboard.dismiss();
        } catch (error) {
            console.error('❌ 검색 오류:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePressQuestion = (item: any) => {
        navigation.navigate('RandomQuestions', { userQuesId: item.userQuesId });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.questionContainer} onPress={() => handlePressQuestion(item)}>
            <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>#{item.userQuesId}</Text>
                <Text style={styles.questionText}>{item.randomQuestion.quesContent}</Text>
            </View>
            <View style={styles.questionFooter}>
                <Text style={styles.dateText}>{item.createdAt.slice(0, 10)}</Text>
                <View style={styles.answerContainer}>
                    <TouchableOpacity style={[styles.answerButton, item.ansStatus === 'MINE' || item.ansStatus === 'ALL' ? styles.activeButton : styles.inactiveButton]}>
                        <Text style={[styles.answerText, item.ansStatus === 'MINE' || item.ansStatus === 'ALL' ? styles.activeText : styles.inactiveText]}>나</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.answerButton, item.ansStatus === 'YOURS' || item.ansStatus === 'ALL' ? styles.activeButton : styles.inactiveButton]}>
                        <Text style={[styles.answerText, item.ansStatus === 'YOURS' || item.ansStatus === 'ALL' ? styles.activeText : styles.inactiveText]}>당신</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#333" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="검색해 주세요"
                    placeholderTextColor="#BEBEBE"
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={() => handleSearch()}
                    returnKeyType="search"
                />
                <TouchableOpacity onPress={() => handleSearch()}>
                    <Ionicons name="search" size={22} color="#333" />
                </TouchableOpacity>
            </View>

            {showResults ? (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => String(item.userQuesId)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={<Text style={styles.noResult}>검색 결과가 없습니다.</Text>}
                    ListFooterComponent={loading ? <ActivityIndicator size="small" color="#999" /> : null}
                />
            ) : (
                <View style={styles.recentContainer}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>최근 검색</Text>
                        <View style={styles.recentActions}>
                            <TouchableOpacity onPress={clearRecentKeywords}>
                                <Text style={styles.recentActionText}>전체삭제</Text>
                            </TouchableOpacity>
                            <Text style={styles.separator}>|</Text>
                            <TouchableOpacity onPress={toggleAutoSave}>
                                <Text style={styles.recentActionText}>
                                    자동저장 {isAutoSave ? '끄기' : '켜기'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.keywordWrapper}>
                        {recentKeywords.map((keyword, index) => (
                            <TouchableOpacity key={index} style={styles.keywordChip} onPress={() => handleSearch(keyword)}>
                                <Text style={styles.keywordText}>{keyword}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

export default QuestionsSearchScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 50, paddingHorizontal: 16 },
    searchBar: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 24,
        backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 20
    },
    input: { flex: 1, paddingHorizontal: 8, fontSize: 16, color: '#333' },
    listContainer: { paddingBottom: 20 },
    questionContainer: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 15, marginBottom: 10 },
    questionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    questionNumber: { fontSize: 14, fontWeight: 'bold', color: '#FF6B6B', marginRight: 8 },
    questionText: { fontSize: 16, color: '#333', flexShrink: 1 },
    questionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateText: { fontSize: 14, color: '#A5A5A5' },
    answerContainer: { flexDirection: 'row', gap: 8 },
    answerButton: { paddingVertical: 5, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1 },
    activeButton: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
    inactiveButton: { backgroundColor: 'white', borderColor: '#D3D3D3' },
    answerText: { fontSize: 14, fontWeight: 'bold' },
    activeText: { color: 'white' },
    inactiveText: { color: '#666' },
    noResult: { textAlign: 'center', color: '#999', paddingTop: 20 },
    recentContainer: { backgroundColor: '#F7F7F7', borderRadius: 12, padding: 16 },
    recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    recentTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
    recentActions: { flexDirection: 'row', alignItems: 'center' },
    recentActionText: { fontSize: 12, color: '#888' },
    separator: { marginHorizontal: 6, fontSize: 12, color: '#888' },
    keywordWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    keywordChip: {
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
        borderWidth: 1, borderColor: '#DCDCDC', marginBottom: 8, backgroundColor: '#fff'
    },
    keywordText: { fontSize: 13, color: '#333' },
});