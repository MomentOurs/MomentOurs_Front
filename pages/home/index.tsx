import React, { useLayoutEffect } from "react";
import {  View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";


type HomeStackParamList = {
    Home: undefined;
    MyPage: undefined;
    NotificationPage: undefined;
    MenuPage: undefined;
};
type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;
const HomeScreen = () => {

    const navigation = useNavigation<HomeStackNavigationProp>(); //

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "홈", 
            headerLeft: () => ( 
                <TouchableOpacity
                    onPress={() => navigation.navigate("MyPage")}
                    style={{ marginLeft: 15 }}
                >
                    <Ionicons name="person-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                    onPress={() => navigation.navigate("NotificationPage")}
                    style={{marginRight: 15}}
                >
                        <Ionicons name="notifications-outline" size={24} color="black" />
                    </TouchableOpacity>  
                
                    <TouchableOpacity
                        onPress={() => navigation.navigate("MenuPage")}
                        style={{marginRight: 30}}
                    >
                        <Ionicons name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>홈 화면!!!!</Text>
        </View>
    );
}

export default HomeScreen;