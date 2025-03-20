import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { createAnswer } from "../../api/index";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    QuestionsRegister: {
        questionId: number;
        questionText: string;
        currentDate: string;
        userQuesId: number;
    };
    RandomQuestions: undefined;
};

type Props = {
    route: RouteProp<RootStackParamList, "QuestionsRegister">;
};

const RandomQuestionScreen: React.FC<Props> = ({ route }) => {
    const { questionId, questionText, currentDate, userQuesId } = route.params;

    const [answer, setAnswer] = useState(""); 
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // ✅ 네비게이션 사용

    // 🔹 답변 입력 버튼 클릭 시 API 요청
    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            Alert.alert("알림", "답변을 입력해 주세요!");
            return;
        }
    
        setLoading(true); // 로딩 시작
    
        try {
            await createAnswer(userQuesId, answer);
            
            Alert.alert("성공", "답변이 등록되었습니다!", [
                { 
                    text: "확인", 
                    onPress: () => navigation.navigate("RandomQuestions") // ✅ 정상적인 화면 이동 처리
                }
            ]);
            setAnswer(""); // 입력값 초기화
        } catch (error) {
            Alert.alert("오류", "답변을 등록하는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <View style={styles.container}>

            {/* 질문 번호 */}
            <Text style={styles.questionNumber}>#{questionId}번째 질문</Text>

            {/* 질문 내용 */}
            <Text style={styles.questionText}>
            {questionText}
            </Text> 

            {/* 날짜 */}
            <Text style={styles.dateText}>{currentDate}</Text>

            {/* 답변 입력 영역 */}
            <Text style={styles.answerLabel}>나의 답변</Text>
            <TextInput
                style={styles.input}
                placeholder="답변을 입력해 주세요."
                placeholderTextColor="#BDBDBD"
                multiline
                value={answer}
                onChangeText={setAnswer}
            />

            {/* 입력 버튼 */}
            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.5 }]} // 로딩 중이면 버튼 비활성화
                onPress={handleSubmitAnswer}
                disabled={loading} // 로딩 중이면 클릭 방지
            >
                <Text style={styles.buttonText}>{loading ? "등록 중..." : "답변 입력"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingTop: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    questionNumber: {
        fontSize: 14,
        color: "#FF8686",
        fontWeight: "600",
        marginBottom: 5,
    },
    questionText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 60,
    },
    dateText: {
        fontSize: 14,
        color: "#A5A5A5",
        marginBottom: 30,
    },
    answerLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        height: 200,
        backgroundColor: "#F7F7F7",
        borderRadius: 10,
        padding: 15,
        textAlignVertical: "top",
        fontSize: 16,
        color: "#000",
    },
    button: {
        width: "100%",
        backgroundColor: "#FF8686",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default RandomQuestionScreen;
