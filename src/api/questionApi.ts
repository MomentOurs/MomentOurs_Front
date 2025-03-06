import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/random-question';

export const getRandomQuestion = async () => {
    try {
        // const response = await axios.get(`${API_BASE_URL}`, {
        //     headers: { Authorization: `Bearer ${token}` },
        // });
        const response = await axios.get(`${API_BASE_URL}`);
        return response.data;
    } catch (error) {
        console.error("랜덤 질문 가져오기 오류:", error);
        throw error;
    }
};
