import React, { useLayoutEffect } from "react";
import {  View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import HomeContainer from "../../src/screens/home/container/home-container";


type HomeStackParamList = {
    Home: undefined;
    MyPageStack: undefined;
    AlertPage: undefined;
    MenuPage: undefined;
};
type HomeStackNavigationProps = StackNavigationProp<HomeStackParamList, "Home">;
const HomeScreen = () => {

    const navigation = useNavigation<HomeStackNavigationProps>(); //

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Momentours", 
            headerLeft: () => ( 
                <TouchableOpacity
                    onPress={() => navigation.navigate("MyPageStack")}
                    style={{ marginLeft: 15 }}
                >
                    <Ionicons name="person-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                    onPress={() => navigation.navigate("AlertPage")}
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
        <HomeContainer/>
    );
}

export default HomeScreen;