import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/random-question';

const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQzMDc3NzMyLCJleHAiOjQ4Mzk5MDc3NzMyfQ.4jj8sOVRdZ92EOZmAZCLCFJxfS_U4zvp1NpeAIpAyCg';


export const getRandomQuestion = async () => {
    try {
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
        const response = await axios.get(`${API_BASE_URL}/list`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            params: {
                lastId: lastId ?? undefined,
                size,
                keyword: keyword ?? undefined, // 검색어가 있을 경우만 전달
            },
        });

        return response.data;
    } catch (error) {
        console.error('랜덤 질문 목록 가져오기 오류:', error);
        throw error;
    }
};
