import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type InquiryStackParamList = {
    Inquiry: undefined;
    InquiryRequest: undefined;
    InquiryHistory: undefined;
};

type InquiryStackNavigationProps = StackNavigationProp<InquiryStackParamList, "Inquiry">;

const InquiryRequestContainer = () => {
    const navigation = useNavigation<InquiryStackNavigationProps>();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = () => {
        if (title.trim() === "" || content.trim() === "") {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        setModalVisible(true);

        setTimeout(() => {
            setModalVisible(false);
            navigation.replace("InquiryHistory");
        }, 800);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>제목</Text>
                    <Text style={styles.charCount}>{`(${title.length}/20)`}</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="제목을 입력해주세요."
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={20}
                />
            </View>

            {/* 내용 입력 */}
            <View style={styles.inputContainer}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>내용</Text>
                    <Text style={styles.charCount}>{`(${content.length}/1000)`}</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="문의 내용을 자세히 작성해주세요."
                    placeholderTextColor="#999"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    maxLength={1000}
                />
            </View>

            {/* 문의 등록 버튼 */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>문의 등록하기</Text>
            </TouchableOpacity>

            {/* 등록 완료 모달 */}
            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>등록이 완료되었습니다.</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 25,
    },
    inputContainer: {
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    label: {
        fontSize: 16
    },
    charCount: {
        fontSize: 14,
        color: "#999",
    },
    input: {
        fontSize: 14,
        color: "#333",
        backgroundColor: "#F8F8F8",
        padding: 12,
        borderRadius: 8,
    },
    textArea: {
        height: 150,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#FF6F61",
        padding: 13,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    submitText: {
        color: "#fff",
        fontSize: 18
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalText: {
        fontSize: 14,
        textAlign: "center",
        color: "#454545"
    },
});

export default InquiryRequestContainer;