import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/comment';

// Postman에서 받은 토큰을 여기에 직접 할당 (임시용)
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJFbWFpbCI6IjExMTFAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfTUVNQkVSIiwiaWF0IjoxNzQzMDc3NzMyLCJleHAiOjQ4Mzk5MDc3NzMyfQ.4jj8sOVRdZ92EOZmAZCLCFJxfS_U4zvp1NpeAIpAyCg';

export const getQuestionComment = async (userQuesId: number) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/question/${userQuesId}`, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        return response.data;
    } catch (error) {
        console.error("랜덤 질문 댓글 가져오기 오류:", error);
        throw error;
    }
};

export const deleteComment = async (commentId: number) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/deactivate/${commentId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`, 
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("댓글 삭제 중 오류:", error);
        throw error;
    }
};

export const createComment = async ({
    comment_content,
    comment_type,
    target_id,
}: {
    comment_content: string;
    comment_type: string;
    target_id: number;
}) => {
    try {
        const response = await axios.post(
            API_BASE_URL,
            {
                comment_content,
                comment_type,
                target_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("댓글 작성 중 오류 발생:", error);
        throw error;
    }
};
