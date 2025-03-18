import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const QuestionCommentScreen = () => {
    const [messages, setMessages] = useState([
        { id: "1", text: "ㅎㅎ 오빠 답변 보니까, 우리 처음 여행 갔을 때 생각난다! 그때 어디였지?", sender: "other", time: "15분전" },
        { id: "2", text: "여수였나?", sender: "me", time: "15분전" },
        { id: "3", text: "응응ㅎㅎㅎ", sender: "other", time: "15분전" },
        { id: "4", text: "여수 밤바다~", sender: "other", time: "14분전" },
        { id: "5", text: "헷", sender: "me", time: "15분전" },
        { id: "6", text: "또 가고싶다!", sender: "me", time: "15분전" },
        { id: "7", text: "올해에 한 번 갈까? 또 기차타고 여행하고 싶어!", sender: "other", time: "13분전" },
        { id: "8", text: "헉 너무 좋아!!! 당장 기차 예매하자! 두근두근두근!", sender: "me", time: "15분전" },
        { id: "9", text: "ㅎㅎ 좋아~ 내가 예매할게~~ 숙소는 호텔? 아님 풀빌라?", sender: "other", time: "13분전" },
        { id: "10", text: "움,,, 풀빌라 가자! ❤️❤️❤️❤️❤️", sender: "me", time: "15분전" },
    ]);

    const [inputText, setInputText] = useState("");

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.messageContainer,
            item.sender === "me" ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
            <Text style={[
                styles.messageText,
                item.sender === "me" ? styles.myMessageText : styles.otherMessageText
            ]}>
                {item.text}
            </Text>
            <Text style={styles.timestamp}>{item.time}</Text>
        </View>
    );

    return (
        <View style={styles.container}>

            {/* 질문 영역 */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                    사랑하는 연인과 가장 행복했던 시간은 언제인가요?
                </Text>
            </View>

            {/* 채팅 리스트 */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatContainer}
                inverted // 최신 메시지가 아래로 가도록 설정
            />

            {/* 입력창 */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="메시지를 입력하세요"
                    placeholderTextColor="#BDBDBD"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton}>
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default QuestionCommentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EAEAEA",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    questionContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
    questionText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        textAlign: "center",
    },
    chatContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    messageContainer: {
        maxWidth: "75%",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    myMessageContainer: {
        backgroundColor: "#FFE3E3",
        alignSelf: "flex-end",
    },
    otherMessageContainer: {
        backgroundColor: "#F5F5F5",
        alignSelf: "flex-start",
    },
    messageText: {
        fontSize: 15,
    },
    myMessageText: {
        color: "#333",
    },
    otherMessageText: {
        color: "#333",
    },
    timestamp: {
        fontSize: 12,
        color: "#A5A5A5",
        alignSelf: "flex-end",
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#EAEAEA",
    },
    input: {
        flex: 1,
        backgroundColor: "#F7F7F7",
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#333",
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: "#FF6B6B",
        borderRadius: 50,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
});
