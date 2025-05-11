import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { SectionList } from "react-native";

{/*고객센터 페이지 */}

type CustomerServiceStackParamList = {
    CustomerService: undefined;
    Help: undefined;
    InquiryStackNavigator: undefined;
    Policy: undefined;
    BusinessInformation: undefined;
    OpenSourceLicense: undefined;
};
type CustomerServiceStackNavigationProps = StackNavigationProp<CustomerServiceStackParamList, "CustomerService">;

type IconNames = 
    |"help-circle-outline"
    |"chatbubble-outline"
    |"document-text-outline"
    |"information-circle-outline"
    |"globe-outline";

const topMenuItems: { id:string; title:string; icon:IconNames; screen: keyof CustomerServiceStackParamList }[] = [
    {id: "1", title: "도움말", icon: "help-circle-outline", screen:"Help" },
    {id: "2", title: "문의", icon: "chatbubble-outline", screen:"InquiryStackNavigator" },
];
const bottomMenuItems: { id:string; title:string; icon:IconNames; screen: keyof CustomerServiceStackParamList }[] = [
    {id: "3", title: "약관 및 정책", icon: "document-text-outline", screen:"Policy" },
    {id: "4", title: "사업자 정보", icon: "information-circle-outline", screen:"BusinessInformation" },
    {id: "5", title: "오픈소스 저작권", icon: "globe-outline", screen:"OpenSourceLicense" },
];

const sections = [
    { title: "", data: topMenuItems },
    { title: "", data: bottomMenuItems },
];

const CustomerServiceScreen = () => {
    const navigation = useNavigation<CustomerServiceStackNavigationProps>();
    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
                        <View style={styles.menuContent}>
                            <Ionicons name={item.icon} size={24} color="#FF6F61" />
                            <Text style={styles.menuText}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
                SectionSeparatorComponent={() => <View style={{ height: 5 }} />}  // ✅ 위아래 간격 조정
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        paddingTop: 10, 
    },
    topMenuList: {
        marginBottom: 0,
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "white",
        marginVertical: 2,
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
    },
});

export default CustomerServiceScreen;