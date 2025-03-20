import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const questions = [
    { id: "120", text: "사랑하는 연인과 가장 행복했던 시간은 언제...", date: "2025.01.04", answered: true },
    { id: "119", text: "연인과 가장 맛있게 먹었던 음식은?", date: "2024.12.30", answered: true },
    { id: "118", text: "나만 아는 당신의 습관은?", date: "2024.12.28", answered: false },
    { id: "117", text: "나만 아는 당신의 습관은?", date: "2024.12.28", answered: false },
    { id: "116", text: "나만 아는 당신의 습관은?", date: "2024.12.28", answered: false },
];

const QuestionsListScreen = () => {
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.questionContainer}>
            <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>#{item.id}</Text>
                <Text style={styles.questionText}>{item.text}</Text>
            </View>
            <View style={styles.questionFooter}>
                <Text style={styles.dateText}>{item.date}</Text>
                <View style={styles.answerContainer}>
                    <TouchableOpacity style={[styles.answerButton, item.answered ? styles.activeButton : styles.inactiveButton]}>
                        <Text style={[styles.answerText, item.answered ? styles.activeText : styles.inactiveText]}>나</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.answerButton, styles.activeButton]}>
                        <Text style={[styles.answerText, styles.activeText]}>당신</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* 상단 네비게이션 바 */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>랜덤질문</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity>
                        <Ionicons name="search" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="filter" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 질문 리스트 */}
            <FlatList
                data={questions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />

            {/* 하단 네비게이션 바 */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}><Text style={styles.navTextActive}>Home</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem}><Text style={styles.navTextInactive}>Buy</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem}><Text style={styles.navTextInactive}>WOW</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem}><Text style={styles.navTextInactive}>World</Text></TouchableOpacity>
                <TouchableOpacity style={styles.navItem}><Text style={styles.navTextInactive}>Profile</Text></TouchableOpacity>
            </View>
        </View>
    );
};

export default QuestionsListScreen;

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
        color: "black",
    },
    iconContainer: {
        flexDirection: "row",
        gap: 15,
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    questionContainer: {
        backgroundColor: "#FAFAFA",
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    questionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FF6B6B",
        marginRight: 8,
    },
    questionText: {
        fontSize: 16,
        color: "#333",
        flexShrink: 1,
    },
    questionFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dateText: {
        fontSize: 14,
        color: "#A5A5A5",
    },
    answerContainer: {
        flexDirection: "row",
        gap: 8,
    },
    answerButton: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
        borderWidth: 1,
    },
    activeButton: {
        backgroundColor: "#FF6B6B",
        borderColor: "#FF6B6B",
    },
    inactiveButton: {
        backgroundColor: "white",
        borderColor: "#D3D3D3",
    },
    answerText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    activeText: {
        color: "white",
    },
    inactiveText: {
        color: "#666",
    },
    bottomNav: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 1,
        borderTopColor: "#EAEAEA",
        paddingVertical: 10,
    },
    navItem: {
        alignItems: "center",
    },
    navTextActive: {
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
        borderBottomWidth: 2,
        borderBottomColor: "black",
        paddingBottom: 5,
    },
    navTextInactive: {
        fontSize: 16,
        color: "#D3D3D3",
    },
});
