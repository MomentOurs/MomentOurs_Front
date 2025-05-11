import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type InquiryListStackParamList = {
    InquiryHistoryList: undefined;
    InquiryHistoryDetail:
    | { uncompletedData: { id: string; title: string; date: string; content: string } }
    | { completedData: { id: string; title: string; date: string; content: string } };
};
type InquiryListStackNavigationProps = StackNavigationProp<InquiryListStackParamList, "InquiryHistoryDetail">;

const InquiryHistoryContainer = () => {

    // 기본 상태 답변 대기
    const [selectedTab, setSelectedTab] = useState("uncompleted");
    //detail로 이동 navigation
    const navigation = useNavigation<InquiryListStackNavigationProps>();


    // 답변 대기
    const uncompletedData = [
        { id: "1", title: "지도의 장소가 안 보여요." ,date: "2025.02.06", content: "제곧내"},
        { id: "2", title: "커플끊기 어떻게 해야 하나요?",date: "2025.02.06", content: "제곧내" },
    ];

    // 답변 완료
    const completedData = [
        { id: "3", title: "앱 내 결제 오류 해결 방법" ,date: "2025.02.06", content: "제곧내", answercontent: "답변 내용입니다."},
        { id: "4", title: "회원 탈퇴는 어디서 하나요?" ,date: "2025.02.06", content: "제곧내", answercontent: "답변 내용입니다."},
    ];

    return (
<View style={styles.container}>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === "uncompleted" && styles.activeTab]}
                    onPress={() => setSelectedTab("uncompleted")}
                >
                    <Text style={[styles.tabText, selectedTab === "uncompleted" && styles.activeTabText]}>답변 대기</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, selectedTab === "completed" && styles.activeTab]}
                    onPress={() => setSelectedTab("completed")}
                >
                    <Text style={[styles.tabText, selectedTab === "completed" && styles.activeTabText]}>답변 완료</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={selectedTab === "uncompleted" ? uncompletedData : completedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.listItem}
                        onPress={() =>
                            navigation.navigate("InquiryHistoryDetail", 
                            selectedTab === "uncompleted"
                                ? { uncompletedData: item }
                                : { completedData: item }
                            )
                        }
                        >
                        <Text style={styles.listText}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#FF6F61",
    },
    tabText: {
        fontSize: 16,
        color: "#777",
    },
    activeTabText: {
        color: "#FF6F61",
        fontWeight: "bold",
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    listText: {
        fontSize: 16,
    },
});
export default InquiryHistoryContainer;