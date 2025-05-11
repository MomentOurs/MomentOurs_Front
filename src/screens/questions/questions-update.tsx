import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { updateAnswer } from "../../api/index";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    QuestionsUpdate: {
        questionId: number;
        questionText: string;
        currentDate: string;
        myQuesAnsId: number;
        myAnswer: string;
    };
    RandomQuestions: undefined;
};

type Props = {
    route: RouteProp<RootStackParamList, "QuestionsUpdate">;
};

const QuestionsUpdateScreen: React.FC<Props> = ({ route }) => {
    const { questionId, questionText, currentDate, myQuesAnsId, myAnswer } = route.params;

    const [answer, setAnswer] = useState(myAnswer);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // 답변 수정 요청
    const handleUpdateAnswer = async () => {
        if (!answer.trim()) {
            Alert.alert("알림", "답변을 입력해 주세요!");
            return;
        }

        setLoading(true); // 로딩 시작

        try {
            await updateAnswer(myQuesAnsId, { quesAnsContent: answer }); 
            Alert.alert("성공", "답변이 수정되었습니다!", [
                { text: "확인", onPress: () => navigation.navigate("RandomQuestions") }, 
            ]);
        } catch (error) {
            Alert.alert("오류", "답변을 수정하는 중 문제가 발생했습니다.");
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <View style={styles.container}>
            {/* 질문 번호 */}
            <Text style={styles.questionNumber}>#{questionId}번째 질문</Text>

            {/* 질문 내용 */}
            <Text style={styles.questionText}>{questionText}</Text> 

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

            {/* 수정 버튼 */}
            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.5 }]}
                onPress={handleUpdateAnswer}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "수정 중..." : "답변 수정"}</Text>
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

export default QuestionsUpdateScreen;
