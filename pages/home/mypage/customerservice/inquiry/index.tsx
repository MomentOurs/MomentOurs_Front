import React from "react";
import { View, Text , FlatList, StyleSheet, TouchableOpacity} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";



{/*문의 페이지*/}

type InquiryStackParamList = {
    Inquiry: undefined;
    InquiryRequest: undefined;
    InquiryHistoryListStack: undefined;
};
type InquiryStackNavigationProps = StackNavigationProp<InquiryStackParamList, "Inquiry">;

type IconNames = 
    |"chatbubble-outline"
    |"reader-outline";

const menuItems: {id: string, title: string, icon: IconNames, screen: keyof InquiryStackParamList}[] = [
    {id: "1", title: "1:1 문의하기", icon: "chatbubble-outline", screen: "InquiryRequest"},
    {id: "2", title: "문의 내역", icon: "reader-outline", screen: "InquiryHistoryListStack"}
];

const InquiryScreen = () => {
    const navigation = useNavigation<InquiryStackNavigationProps>();

    return (
        <View>
            <FlatList
                data={menuItems}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate(item.screen)}
                    >
                        <View style={styles.menuContent}>
                            <Ionicons name={item.icon} size={24} color="#FF6F61" />
                            <Text style={styles.menuText}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "white",
        marginVertical: 4,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    menuContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuText: {
        fontSize: 16,
        marginLeft: 10,
    }
});

export default InquiryScreen;