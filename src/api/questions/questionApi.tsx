import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080/api/random-question';

export const getRandomQuestion = async () => {
    try {
        const TOKEN = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        // const response = await axios.get(`${API_BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error("랜덤 질문 가져오기 오류:", error);
        throw error;
    }
};

export const getRandomQuestionById = async (userQuesId: number) => {
    try {
        const TOKEN = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/detail/${userQuesId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        return response.data;
    } catch (error) {
        console.error('특정 질문 가져오기 오류:', error);
        throw error;
    }
};

/**
 * 커서 기반으로 랜덤 질문 목록을 불러오는 API
 * @param lastId 마지막 userQuesId (없으면 최신부터 시작)
 * @param size 가져올 개수 (기본 10)
 * @returns 질문 리스트, 다음 커서 ID, hasNext 여부 포함 응답
 */
export const getRandomQuestionList = async (
    lastId?: number,
    size: number = 10,
    keyword?: string 
) => {
    try {
        const TOKEN = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/list`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            params: {
                lastId: lastId ?? undefined,
                size,
                keyword: keyword ?? undefined, 
            },
        });

        return response.data;
    } catch (error) {
        console.error('랜덤 질문 목록 가져오기 오류:', error);
        throw error;
    }
};
