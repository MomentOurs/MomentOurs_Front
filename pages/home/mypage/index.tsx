import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

{/*마이페이지 페이지*/}

type MyPageStackParamList = {
    MyPage: undefined;
    MyProfile: undefined;
    MemoriesHistory: undefined;
    Notice: undefined;
    CustomerServiceStackNavigator: undefined;
    MyInquiries: undefined;
};
type MyPageStackNavigationProps = StackNavigationProp<MyPageStackParamList, "MyPage">;

type IconNames =
    | "person-outline"
    | "document-text-outline"
    | "megaphone-outline"
    | "call-outline"
    | "reader-outline";

const topMenuItems: { id: string; title: string; icon: IconNames; screen: keyof MyPageStackParamList }[] = [
    { id: "1", title: "마이 프로필", icon: "person-outline", screen: "MyProfile" },
    { id: "2", title: "작성한 추억 조회하기", icon: "document-text-outline", screen: "MemoriesHistory" }
];
    
const bottomMenuItems: { id: string; title: string; icon: IconNames; screen: keyof MyPageStackParamList }[] = [
    { id: "3", title: "공지사항", icon: "megaphone-outline", screen: "Notice" },
    { id: "4", title: "고객센터", icon: "call-outline", screen: "CustomerServiceStackNavigator" },
    /*{ id: "5", title: "문의", icon: "reader-outline", screen: "MyInquiries" }*/
];

const MyPageScreen = () => {
    const navigation = useNavigation<MyPageStackNavigationProps>(); 
    return (
        <View style={styles.container}>

            {/* 커스텀 헤더 */}
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>마이페이지</Text>
                <View style={{ width: 24 }} />
            </View>


            {/* 프로필 섹션 */}
            <View style={styles.profileContainer}>
                <Image
                    source={require("../../../assets/profile.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>지연</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusMessage}>승철님과 사랑중</Text>
                </View>
            </View>


            {/* 일수, 포인트 섹션 */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>120일</Text>
                    <Text style={styles.statLabel}>랜덤질문 일수</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>270일째</Text>
                    <Text style={styles.statLabel}>함께한 날</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>543P</Text>
                    <Text style={styles.statLabel}>포인트</Text>
                </View>
            </View>


            {/* 메뉴 섹션1 (프로필, 추억) */}
            <FlatList
                data={topMenuItems}
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
                        <Ionicons name="chevron-forward"size={20} color="#ccc" />
                    </TouchableOpacity>
                )}
            />

            {/* 메뉴 섹션2 (공지사항, 고객센터) */}
            <FlatList
                data={bottomMenuItems}
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


            {/* 로그아웃 버튼 섹션*/}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    customHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    profileContainer: {
        alignItems: "center",
        paddingVertical: 20,
        backgroundColor: "white",
        marginBottom: 10,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
    },
    statusMessage: {
        fontSize: 14,
        color: "#FF6F61",
        marginTop: 5,
        
    },
    statusContainer: {
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderWidth: 1.5, 
        borderColor: "#FF6F61",
        borderRadius: 20, 
        alignItems: "center",
        justifyContent: "center",
        
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingVertical: 15,
        marginBottom: 10,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 18,
        fontWeight: "bold",
    },
    statLabel: {
        fontSize: 12,
        color: "#777",
    },
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
    },
    logoutButton: {
        alignItems: "center",
        marginTop: 20,
    },
    logoutText: {
        fontSize: 16,
        color: "red",
    }
});


export default MyPageScreen;