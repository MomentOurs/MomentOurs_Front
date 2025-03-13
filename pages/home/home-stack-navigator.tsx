import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../home/index";
import MyPageModal from "../../src/screens/home/setting-modal";
import NotificationModal from "../../src/screens/home/notificaion-modal";
import MenuModal from "../../src/screens/home/menu-modal";

type HomeStackParamList = {
    HomeScreen: undefined;
    MyPage: undefined;
    NotificationPage: undefined;
    MenuPage: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="MyPage" component={MyPageModal} options={{ title: "마이페이지" }} />
            <Stack.Screen name="NotificationPage" component={NotificationModal} options={{title: "알림페이지"}} />
            <Stack.Screen name="MenuPage" component={MenuModal} options={{title:"전체 메뉴 서비스 페이지"}} />
        </Stack.Navigator>
    );
};

export default HomeStackNavigator;