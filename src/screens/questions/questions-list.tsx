import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getRandomQuestionList } from "../../api/index";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    RandomQuestions: { userQuesId: number };
    QuestionsSearch: undefined;
};

const QuestionsListScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const [lastId, setLastId] = useState<number | null>(null);

    const fetchQuestions = useCallback(async () => {
        if (loading || !hasNext) return;

        setLoading(true);
        try {
            const res = await getRandomQuestionList(lastId, 10);
            const { list, nextCursorId, hasNext: more } = res.data;

            if (list.length === 0) {
                setHasNext(false);
            } else {
                setQuestions(prev => [...prev, ...list]);
                setLastId(nextCursorId);
                setHasNext(more);
            }
        } catch (err) {
            console.error("❌ 질문 목록 가져오기 실패:", err);
        } finally {
            setLoading(false);
        }
    }, [lastId, loading, hasNext]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handlePressQuestion = (item: any) => {
        navigation.navigate("RandomQuestions", { userQuesId: item.userQuesId });
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const displayNumber = questions.length - index;

        return (
            <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => handlePressQuestion(item)}
            >
                <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>#{displayNumber}</Text>
                    <Text style={styles.questionText}>{item.randomQuestion.quesContent}</Text>
                </View>
                <View style={styles.questionFooter}>
                    <Text style={styles.dateText}>{item.createdAt.slice(0, 10)}</Text>
                    <View style={styles.answerContainer}>
                        <TouchableOpacity
                            style={[
                                styles.answerButton,
                                item.ansStatus === "MINE" || item.ansStatus === "ALL"
                                    ? styles.activeButton
                                    : styles.inactiveButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.answerText,
                                    item.ansStatus === "MINE" || item.ansStatus === "ALL"
                                        ? styles.activeText
                                        : styles.inactiveText
                                ]}
                            >
                                나
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.answerButton,
                                item.ansStatus === "YOURS" || item.ansStatus === "ALL"
                                    ? styles.activeButton
                                    : styles.inactiveButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.answerText,
                                    item.ansStatus === "YOURS" || item.ansStatus === "ALL"
                                        ? styles.activeText
                                        : styles.inactiveText
                                ]}
                            >
                                당신
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>랜덤질문</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('QuestionsSearch')}>
                        <Ionicons name="search" size={24} color="black" />
                    </TouchableOpacity>
                </View>

            </View>

            <FlatList
                data={questions}
                keyExtractor={(item) => String(item.userQuesId)}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                onEndReached={fetchQuestions}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? <ActivityIndicator size="small" color="#999" /> : null
                }
            />
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
});
