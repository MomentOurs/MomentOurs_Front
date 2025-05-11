import { useRoute , RouteProp} from "@react-navigation/native";
import React from "react";
import {  View, Text, StyleSheet } from "react-native";


type InquiryListStackParamList = {
    InquiryHistoryDetail:
    | { uncompletedData: { id: string; title: string; date: string; content: string } }
    | { completedData: { id: string; title: string; date: string; content: string ;answercontent: string} };
}


const InquiryDetailContainer = () => {
    const route = useRoute<RouteProp<InquiryListStackParamList,"InquiryHistoryDetail">>(); 
    const inquiry =
        "uncompletedData" in route.params ? route.params.uncompletedData : route.params.completedData;
    const isUncompleted = "uncompletedData" in route.params;
    const isCompleted = "completedData" in route.params;
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.qBadge}>
                            <Text style={styles.qText}>Q</Text>
                        </View>
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.title}>{inquiry.title}</Text>
                            <Text style={styles.date}>{inquiry.date}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <Text style={styles.content}>{inquiry.content}</Text>
                </View>

                {isUncompleted && (
                    <View style={styles.noticeBox}>
                        <Text style={styles.noticeBoxText}>아직 답변이 달리지 않았어요. 곧 답변 드릴게요!</Text>
                    </View> 
                )}

                {isCompleted && (
                    <View style={styles.answerCard}>
                        <View style={styles.answerCardHeader}>
                            <View style={styles.aBadge}>
                                <Text style={styles.aText}>A</Text>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.answerTitle}>답변이 등록되었어요!</Text>
                            </View>
                        </View>
                        <Text style={styles.answerContent}>{route.params.completedData.answercontent}</Text>
                    </View>
                )}

            </View>
            );

};
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#FAFAFA",
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 20,
        width: "100%",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    qBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFF0F0",
        justifyContent: "center",
        alignItems: "center",
    },
    qText: {
        color: "#FF6F61",
        fontSize: 23,
    },
    title: {
        fontSize: 16,
        marginBottom: 3,
        color: "#333",
    },
    date: {
        fontSize: 13,
        color: "#bbb",
        marginBottom: 3,
    },
    divider: {
        height: 1,
        backgroundColor: "#EAEAEA",
        marginVertical: 3,
    },
    content: {
        fontSize: 15,
        color: "#5D5D5D",
        lineHeight: 22,
        marginTop: 20
    },
    noticeBox: {
        backgroundColor: "#F5827D",
        padding:20,
        borderRadius: 5,
        marginTop: 30,
        width: "100%",
    },
    noticeBoxText:{
        color: "white"
    },
    answerCard: {
        backgroundColor: "#fff",
        borderRadius: 5,
        padding: 20,
        width: "100%",
        marginTop: 20
    },
    answerCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    aBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#FFF0F0",
        justifyContent: "center",
        alignItems: "center",
    },
    aText: {
        color: "#FF6F61",
        fontSize: 23,
    },
    answerTitle: {
        fontSize: 16,
        marginBottom: 3,
        color: "#333",
    },
    answerContent: {
        fontSize: 15,
        color: "#5D5D5D",
        lineHeight: 22,
        marginTop: 8,
    },
});

export default InquiryDetailContainer;