import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getQuestionComment, deleteComment } from "../../api/index";
import { useRoute } from "@react-navigation/native";
import DeleteModal from "../../components/common/DeleteModal";
import { createComment } from "../../api/index";

const QuestionCommentScreen = ({ navigation }: any) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState("");
    const [selectedComment, setSelectedComment] = useState<any | null>(null);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteMessage, setShowDeleteMessage] = useState(false);

    const route = useRoute();
    const { userQuesId, questionId, questionText } = route.params as any;

    const myMemberId = 2;

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "오후" : "오전";
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;
        return `${ampm} ${displayHour}:${minutes}`;
    };

    const fetchComments = async () => {
        try {
            const comments = await getQuestionComment(userQuesId);
            const mapped = comments.map((comment: any) => ({
                id: String(comment.commentId),
                text: comment.commentContent,
                sender: comment.memberId === myMemberId ? "me" : "other",
                time: formatTime(comment.createdAt),
            }));
            setMessages(mapped);
        } catch (err) {
            console.error("댓글 로딩 실패", err);
        }
    };

    // 댓글 전송 함수
    const handleSendComment = async () => {
        if (!inputText.trim()) return;

        try {
            await createComment({
                comment_content: inputText,
                comment_type: "QUESTION",
                target_id: userQuesId,
            });

            setInputText(""); // 입력 초기화
            fetchComments(); // 목록 갱신
        } catch (err) {
            console.error("❌ 댓글 작성 실패", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [userQuesId]);

    const handleLongPress = (item: any) => {
        if (item.sender === "me") {
            setSelectedComment(item);
            setShowActionSheet(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedComment) return;
        try {
            await deleteComment(Number(selectedComment.id));
            setMessages(prev => prev.filter(msg => msg.id !== selectedComment.id));
            setShowDeleteMessage(true);
            setTimeout(() => setShowDeleteMessage(false), 1500);
        } catch (e) {
            console.error("❌ 삭제 실패", e);
        } finally {
            setSelectedComment(null);
            setShowDeleteModal(false);
        }
    };

    const renderMessage = ({ item }: { item: any }) => (
        <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View style={[
                styles.messageContainer,
                item.sender === "me" ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
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

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.chatContainer}
                inverted={false}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="메시지를 입력하세요"
                    placeholderTextColor="#BDBDBD"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendComment}>
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* ✅ 액션시트 */}
            <Modal
                visible={showActionSheet}
                animationType="slide"
                transparent
                onRequestClose={() => setShowActionSheet(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowActionSheet(false)}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback>
                            <View style={styles.actionSheet}>
                                <TouchableOpacity onPress={() => {
                                    console.log("✏️ 수정 기능 준비 중");
                                    setShowActionSheet(false);
                                }}>
                                    <Text style={styles.actionText}>수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setShowActionSheet(false);
                                    setShowDeleteModal(true);
                                }}>
                                    <Text style={[styles.actionText, { color: 'red' }]}>삭제</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowActionSheet(false)}>
                                    <Text style={styles.actionCancel}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* ✅ 삭제 확인 모달 */}
            <DeleteModal
                isVisible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleConfirmDelete}
            />

            {/* ✅ 삭제 완료 메시지 */}
            {showDeleteMessage && (
                <View style={styles.deleteMessage}>
                    <Text style={styles.deleteMessageText}>삭제되었습니다</Text>
                </View>
            )}
        </View>
    );
};

export default QuestionCommentScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
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
        marginBottom: 10,
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
    messageText: { fontSize: 15, color: "#333" },
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
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },
    actionSheet: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
    },
    actionText: {
        fontSize: 18,
        paddingVertical: 10,
        textAlign: "center",
    },
    actionCancel: {
        fontSize: 18,
        paddingVertical: 12,
        textAlign: "center",
        color: "#aaa",
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
});
