import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const RandomQuestionScreen = () => {
    return (
        <View style={styles.container}>

            {/* 질문 번호 */}
            <Text style={styles.questionNumber}>#120번째 질문</Text>

            {/* 질문 내용 */}
            <Text style={styles.questionText}>
                사랑하는 연인과 가장 행복했던{"\n"}시간은 언제인가요?
            </Text> 

            {/* 날짜 */}
            <Text style={styles.dateText}>2025.01.04</Text>

            {/* 답변 입력 영역 */}
            <Text style={styles.answerLabel}>지연님의 답변</Text>
            <TextInput
                style={styles.input}
                placeholder="답변을 입력해 주세요."
                placeholderTextColor="#BDBDBD"
                multiline
            />

            {/* 입력 버튼 */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>답변 입력</Text>
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
        fontSize: 18,
        color: "#333",
        textAlign: "center",
        fontWeight: "500",
        marginBottom: 5,
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
