import React, { useEffect, useState, useCallback } from 'react';
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
import { getRandomQuestion, getQuestionAnswers, deleteAnswer } from '../../api/index';
import DeleteModal from '../../components/common/DeleteModal';

type RootStackParamList = {
    Questions: undefined;
    QuestionsRegister: { questionId: number; questionText: string; currentDate: string; userQuesId: number; };
    QuestionComment: { userQuesId: number; questionId: number; questionText: string };
    QuestionsUpdate: { questionId: number; questionText: string; currentDate: string; myQuesAnsId: number; myAnswer: string; };
};
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

const QuestionsScreen: React.FC<Props> = ({ navigation }) => {
    const [questionId, setQuestionId] = useState<number | null>(null);
    const [questionText, setQuestionText] = useState<string | null>(null);
    const [userQuesId, setUserQuesId] = useState<number | null>(null);
    const [myQuesAnsId, setMyQuesAnsId] = useState<number | null>(null);
    const [myAnswer, setMyAnswer] = useState<string | null>(null);
    const [otherAnswer, setOtherAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState<boolean>(false);

    const fetchQuestionAndAnswers = useCallback(async () => {
        try {
            const questionData = await getRandomQuestion();
            if (questionData.success && questionData.data) {
                setQuestionId(questionData.data.coupleQuesNo);
                setQuestionText(questionData.data.randomQuestion.quesContent);
                setUserQuesId(questionData.data.userQuesId);

                const answerData = await getQuestionAnswers(questionData.data.userQuesId);
                if (answerData.success && answerData.data) {
                    setMyAnswer(answerData.data.myAnswer || "이곳을 눌러서 답변을 입력해 주세요.");
                    setOtherAnswer(answerData.data.otherAnswer || "상대방이 아직 답변하지 않았어요.");
                    setMyQuesAnsId(answerData.data.myQuesAnsId);
                }
            }
        } catch (error) {
            console.error('질문 및 답변 불러오는 중 오류 발생:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // 답변 삭제 함수 (서버에도 삭제 요청)
    const handleDeleteAnswer = async () => {
        if (!questionId) return;

        setIsDeleting(true);
        try {
            await deleteAnswer(questionId);

            // 삭제 후 다시 데이터 새로 불러오기
            await fetchQuestionAndAnswers();

            setShowDeleteMessage(true);
            setTimeout(() => {
                setShowDeleteMessage(false);
            }, 1000);
        } catch (error) {
            console.error("답변 삭제 중 오류 발생:", error);
        } finally {
            setIsDeleting(false);
            setModalVisible(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/-/g, '.');
        setCurrentDate(formattedDate);

        const fetchQuestionAndAnswers = async () => {
            try {
                const questionData = await getRandomQuestion();
                if (questionData.success && questionData.data) {
                    setQuestionId(questionData.data.coupleQuesNo);
                    setQuestionText(questionData.data.randomQuestion.quesContent);
                    setUserQuesId(questionData.data.userQuesId);

                    const answerData = await getQuestionAnswers(questionData.data.userQuesId);
                    if (answerData.success && answerData.data) {
                        setMyAnswer(answerData.data.myAnswer || null);
                        setOtherAnswer(answerData.data.otherAnswer || "상대방이 아직 답변하지 않았어요.");
                        setMyQuesAnsId(answerData.data.myQuesAnsId);
                    }
                }
            } catch (error) {
                console.error('질문 및 답변 불러오는 중 오류 발생:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionAndAnswers();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.date}>Day</Text>
                <Text style={styles.dateNumber}>{currentDate}</Text>

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

                {/* 나의 답변 입력 필드 */}
                <View style={styles.answerContainer}>
                    <View style={styles.answerHeader}>
                        <Text style={styles.answerLabel}>나의 답변</Text>

                        {/* 수정 아이콘 */}
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => {
                                if (!myAnswer || !myQuesAnsId) return;
                                navigation.navigate('QuestionsUpdate', {
                                    questionId,
                                    questionText,
                                    currentDate,
                                    myQuesAnsId,
                                    myAnswer,
                                });
                            }}
                        >
                            <Image source={require('../../../assets/images/common/edit-icon.png')} style={styles.icon} />
                        </TouchableOpacity>

                        {/* 삭제 아이콘 */}
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setModalVisible(true)}
                            disabled={isDeleting} // 삭제 중에는 버튼 비활성화
                        >
                            <Image source={require('../../../assets/images/common/trash-icon.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (!myAnswer || myAnswer.trim() === "") {
                                navigation.navigate('QuestionsRegister', {
                                    questionId,
                                    questionText,
                                    currentDate,
                                    userQuesId,
                                });
                            }
                        }}
                        activeOpacity={0.8}
                        disabled={!!myAnswer && myAnswer.trim() !== ""}
                        style={[styles.answerInputContainer, !!myAnswer && myAnswer.trim() !== "" && { opacity: 0.5 }]}
                    >
                        <TextInput
                            style={styles.answerInput}
                            placeholder="이곳을 눌러서 답변을 입력해 주세요."
                            placeholderTextColor="#7B7B7B"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={myAnswer || ""}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>


                </View>

                {/* 상대방의 답변 필드 */}
                <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>상대방의 답변</Text>
                    <TextInput
                        style={styles.disabledAnswerInput}
                        value={otherAnswer || "상대방이 아직 답변하지 않았어요."}
                        editable={false}
                        textAlignVertical="top"
                        multiline={true}
                    />
                </View>
            </ScrollView>

            {/* 삭제 완료 메시지 표시 */}
            {showDeleteMessage && (
                <View style={styles.deleteMessage}>
                    <Text style={styles.deleteMessageText}>삭제되었습니다</Text>
                </View>
            )}

            <DeleteModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onDelete={handleDeleteAnswer} // 삭제 요청 함수 연결
            />

            <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('QuestionComment', { userQuesId, questionId, questionText })}>
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
    icon: {
        width: 15,
        height: 15,
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
        marginTop: 20,
    },
    answerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    answerLabel: {
        fontSize: 16,
    },
    iconButton: {
        marginLeft: 8, // 아이콘 간격 조정
    },
    answerInput: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#F4F4F4',
        minHeight: 45,
    },
    disabledAnswerInput: {
        width: '100%',
        padding: 15,
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
    deleteMessage: {
        position: 'absolute',
        top: 50,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 8,
    },
    deleteMessageText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    answerInputContainer: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: '#F4F4F4',
        minHeight: 45,
        justifyContent: 'center',
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