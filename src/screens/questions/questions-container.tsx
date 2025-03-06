import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getRandomQuestion } from '../../api/questionApi';

// 🔹 네비게이션 타입 정의
type RootStackParamList = {
    Questions: undefined;
};
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Questions'>;
};

const QuestionsScreen: React.FC<Props> = ({ navigation }) => {
    const [questionId, setQuestionId] = useState<number | null>(null);
    const [questionText, setQuestionText] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState<string>(''); // ✅ 오늘 날짜 상태 추가

    useEffect(() => {
        // ✅ 현재 날짜 가져오기 (YYYY.MM.DD 형식)
        const today = new Date();
        const formattedDate = today.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('T')[0].replace(/-/g, '.'); // 2024.03.05 형식
        setCurrentDate(formattedDate);

        const fetchQuestion = async () => {
            try {
                const data = await getRandomQuestion();
                if (data.success && data.data) {
                    setQuestionId(data.data.quesId);
                    setQuestionText(data.data.quesContent);
                }
            } catch (error) {
                console.error('질문을 불러오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, []);

    return (
        <View style={styles.container}>
            {/* 🔹 스크롤 가능한 질문 UI */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.date}>Day</Text>
                {/* ✅ 오늘 날짜 표시 */}
                <Text style={styles.dateNumber}>{currentDate}</Text>

                {/* 하트 이미지 */}
                <View style={styles.heartContainer}>
                    <Image source={require('../../../assets/images/questions/heart.png')} style={styles.heart} />
                </View>

                {loading ? (
                    <Text style={styles.loadingText}>질문을 불러오는 중...</Text>
                ) : (
                    <>
                        <Text style={styles.questionNumber}>#{questionId}번째 질문</Text>
                        <Text style={styles.questionText}>{questionText}</Text>
                    </>
                )}

                {/* 🔹 답변 입력 필드 */}
                <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>지연님의 답변</Text>
                    <TextInput
                        style={styles.answerInput}
                        placeholder="이곳을 눌러서 답변을 입력해 주세요."
                        placeholderTextColor="#7B7B7B"
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>승철님의 답변</Text>
                    <TextInput
                        style={styles.disabledAnswerInput}
                        value="승철님이 아직 답변하지 않았어요."
                        editable={false}
                        textAlignVertical="top"
                        multiline={true}
                    />
                </View>
            </ScrollView>

            {/* 🔹 우측 하단 채팅 버튼 */}
            <TouchableOpacity style={styles.chatButton} onPress={() => console.log('댓글 버튼 클릭')}>
                <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default QuestionsScreen;

// 🔹 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    date: {
        fontSize: 14,
        fontWeight: '600',
        color: '#454545',
    },
    dateNumber: {
        fontSize: 14,
        marginVertical: 5,
        color: '#454545',
    },
    heartContainer: {
        marginVertical: 10,
    },
    heart: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    questionNumber: {
        fontSize: 14,
        color: '#454545',
        marginTop: 10,
    },
    questionText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 60,
    },
    answerContainer: {
        width: '100%',
        paddingHorizontal: 2,
        marginTop: 20,
    },
    answerLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    answerInput: {
        width: '100%',
        padding: 15,
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: 10,
        backgroundColor: '#F4F4F4',
        minHeight: 45,
    },
    disabledAnswerInput: {
        width: '100%',
        padding: 15,
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: 10,
        backgroundColor: '#F4F4F4',
        color: '#7B7B7B',
        minHeight: 45,
        textAlignVertical: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#888',
        marginVertical: 20,
    },
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#ff6b81',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
});
