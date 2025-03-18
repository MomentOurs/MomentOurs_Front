import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/random-question';

const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQyMjkzMzY2LCJleHAiOjQ4Mzk4MjkzMzY2fQ.I-pg6zBtD7jpD23Bp1idpnNQM8744d9lJePi7lFfaJU'; 


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
