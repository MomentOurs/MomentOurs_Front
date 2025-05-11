import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { View, Text , TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

{/* 공지 페이지(공지 목록) */}

type NoticeStackParamList = {
    NoticeList: undefined;
    NoticeDetail: { notice: { id: string; title: string; date: string; content: string } };
};
type NoticeStackNavigationProps = StackNavigationProp<NoticeStackParamList, "NoticeList">;

const notices = [
    { id: "1", title: "업데이트 관련 안내", date: "2025.02.06", content: "새로운 UI/UX 개선, 버그 수정, 성능 향상 등이 포함된 업데이트 안내입니다."},
    { id: "2", title: "새로운 기능 추가 관련 안내", date: "2024.12.18", content: "새로운 기능이 추가되었습니다. 자세한 내용은 공지사항을 확인해주세요." }
];


const NoticeListContainer = () => {

    const navigation = useNavigation<NoticeStackNavigationProps>();
    return (
        <View style={styles.container}>
            <FlatList 
                data={notices}
                keyExtractor={(item) => item.id}
                renderItem = {({item}) => (
                    <TouchableOpacity 
                        style={styles.noticeItem} 
                        onPress={() => navigation.navigate("NoticeDetail", { notice: item })}
                        >
                        <View style={styles.textContainer}>
                            <Text style={styles.noticeDate}>{item.date}</Text>
                            <Text style={styles.noticeTitle}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 20
    },
    noticeItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-between",
    },
    noticeDate: {
        fontSize: 12,
        color: "#888",
        marginBottom: 5
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: "bold"
    },
    textContainer: {
        flexDirection: "column",
    },
});
export default NoticeListContainer;