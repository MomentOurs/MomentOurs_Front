import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";


type NoticeStackParamList = {
    NoticeDetail: { notice: { id: string; title: string; date: string; content: string } };
};


const NoticeDetailContainer = () => {
    const route = useRoute<RouteProp<NoticeStackParamList, "NoticeDetail">>(); 
    const { notice } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{notice.title}</Text>
            <Text style={styles.date}>{notice.date}</Text>
            <Text style={styles.content}>{notice.content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
        alignItems: "flex-start", 
        justifyContent: "flex-start",  
    },
    title:{
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10
    },
    date:{
        fontSize: 14,
        color: "#AAA",
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1, 
        borderBottomColor: "#DDD", 
        width: "100%"
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
    }
})
export default NoticeDetailContainer;