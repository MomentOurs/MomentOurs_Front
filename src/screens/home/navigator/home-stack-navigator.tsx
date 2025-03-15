import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../../pages/home/index";
import MyPageStackNavigator from "./mypage-stack-navigator";
import AlertScreen from "../../../../pages/home/alert";
import MenuScreen from "../../../../pages/home/menu";

type HomeStackParamList = {
    HomeScreen: undefined;
    MyPageStack: undefined;
    AlertPage: undefined;
    MenuPage: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="MyPageStack" component={MyPageStackNavigator} options={{ headerShown: false}} />
            <Stack.Screen name="AlertPage" component={AlertScreen} options={{title: "알림"}} />
            <Stack.Screen name="MenuPage" component={MenuScreen} options={{title:"전체 서비스"}} />
        </Stack.Navigator>
    );
};

export default HomeStackNavigator;