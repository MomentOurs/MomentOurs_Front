import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/random-question';

const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQxNjAzNzEzLCJleHAiOjQ4Mzk3NjAzNzEzfQ.vhrQMO3zazm9xgtVq7SqvWBzTNXvcPm-YTAFk-4e96g'; 


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
