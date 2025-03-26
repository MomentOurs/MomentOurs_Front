import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getQuestionComment } from "../../api/index"; // 🔹 실제 경로로 수정
import { useRoute } from "@react-navigation/native";

const QuestionCommentScreen = ({ navigation }: any) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");

    const route = useRoute();
    const { userQuesId, questionId, questionText } = route.params as any;

    const myMemberId = 2; // 로그인 유저 ID

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
    
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
    
        const ampm = hours >= 12 ? "오후" : "오전";
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    
        return `${ampm} ${displayHour}:${minutes}`;
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comments = await getQuestionComment(userQuesId);
                const mapped = comments.map((comment: any) => ({
                    id: String(comment.commentId),
                    text: comment.commentContent,
                    sender: comment.memberId === myMemberId ? "me" : "other",
                    time: formatTime(comment.createdAt),
                }));
                setMessages(mapped.reverse());
            } catch (err) {
                console.error("댓글 로딩 실패", err);
            }
        };
        fetchComments();
    }, [userQuesId]);

    const renderMessage = ({ item }: { item: any }) => (
        <View style={[
            styles.messageContainer,
            item.sender === "me" ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>{item.time}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* ✅ 상단 커스텀 헤더 */}
            <SafeAreaView style={{ backgroundColor: '#fff' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={26} color="black" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.questionNumber}>#{questionId}</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="search" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <Text style={styles.headerQuestion}>{questionText}</Text>

            {/* 채팅 내용 */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatContainer}
                inverted
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
        paddingHorizontal: 15,
        paddingBottom: 10,
        backgroundColor: "#fff",
    },
    headerCenter: {
        flex: 1,
        marginHorizontal: 10,
        alignItems: "center",
    },
    questionNumber: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B81",
    },
    headerQuestion: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
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
