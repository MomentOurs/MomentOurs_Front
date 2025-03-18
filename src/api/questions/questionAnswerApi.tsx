import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/randomquestion-answer';

// 🔹 Postman에서 받은 토큰을 여기에 직접 할당 (임시용)
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQyMjkzMzY2LCJleHAiOjQ4Mzk4MjkzMzY2fQ.I-pg6zBtD7jpD23Bp1idpnNQM8744d9lJePi7lFfaJU'; 

export const getQuestionAnswers = async (userQuesId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${userQuesId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }, // 🔹 토큰 추가
        });
        return response.data;
    } catch (error) {
        console.error("랜덤 질문 답변 가져오기 오류:", error);
        throw error;
    }
};

export const deleteAnswer = async (userQuesId: number) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${userQuesId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        return response.data;
    } catch (error) {
        console.error("❌ 답변 삭제 중 오류 발생:", error);
        throw error;
    }
};

export const createAnswer = async (quesAnsContent: string, userQuesId: number) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}`,
            {
                quesAnsContent,
                userQuesId,
            },
            {
                headers: {
                    "Authorization": TOKEN,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data; // 성공 응답 반환
    } catch (error) {
        console.error("❌ 답변 등록 중 오류 발생:", error);
        throw error;
    }
};