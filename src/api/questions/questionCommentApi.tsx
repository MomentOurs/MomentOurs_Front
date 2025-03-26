import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/comment';

// 🔹 Postman에서 받은 토큰을 여기에 직접 할당 (임시용)
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQyMjkzMzY2LCJleHAiOjQ4Mzk4MjkzMzY2fQ.I-pg6zBtD7jpD23Bp1idpnNQM8744d9lJePi7lFfaJU'; 

export const getQuestionComment = async (userQuesId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/question/${userQuesId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }, // 🔹 토큰 추가
        });
        return response.data;
    } catch (error) {
        console.error("랜덤 질문 댓글 가져오기 오류:", error);
        throw error;
    }
};