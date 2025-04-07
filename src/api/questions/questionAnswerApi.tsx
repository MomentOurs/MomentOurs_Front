import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/randomquestion-answer';

// Postman에서 받은 토큰을 여기에 직접 할당 (임시용)
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQzMDc3NzMyLCJleHAiOjQ4Mzk5MDc3NzMyfQ.4jj8sOVRdZ92EOZmAZCLCFJxfS_U4zvp1NpeAIpAyCg'; 

export const getQuestionAnswers = async (myQuesAnsId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${myQuesAnsId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }, 
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
        console.error("답변 삭제 중 오류 발생:", error);
        throw error;
    }
};

export const createAnswer = async (userQuesId: number, quesAnsContent: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}`, 
            { userQuesId, quesAnsContent },
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("답변 작성 중 오류 발생:", error);
        throw error;
    }
};

export const updateAnswer = async (userQuesId: number, payload: { quesAnsContent: string }) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/${userQuesId}`, payload,
            {
                headers: { Authorization: `Bearer ${TOKEN}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("답변 수정 중 오류 발생:", error);
        throw error;
    }
};