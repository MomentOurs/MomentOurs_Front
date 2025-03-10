import React, { useLayoutEffect } from "react";
import {  View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";


type HomeStackParamList = {
    Home: undefined;
    Settings: undefined;
};
type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;
const HomeScreen = () => {

    const navigation = useNavigation<HomeStackNavigationProp>(); //

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "홈", 
            headerRight: () => ( 
                <TouchableOpacity
                    onPress={() => navigation.navigate("Settings")}
                    style={{ marginRight: 15 }}
                >
                    <Ionicons name="settings-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>홈 화면</Text>
        </View>
    );
}

export default HomeScreen;