import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyPageScreen from "../../../../pages/home/mypage";
import MyProfileScreen from "../../../../pages/home/mypage/myprofile";
import MemoriesHistoryScreen from "../../../../pages/home/mypage/memorieshistory";
import NoticeStackNavigator from "./notice-stack-navigator";
import CustomerServiceStackNavigator from "./customerservice-stack-navigator";

type MyPageStackParamList = {
    MyPage: undefined;
    MyProfile: undefined;
    MemoriesHistory: undefined;
    Notice: undefined;
    CustomerServiceStackNavigator: undefined;
    MyInquiries: undefined;
};

const Stack = createStackNavigator<MyPageStackParamList>();

const MyPageStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MyPage" component={MyPageScreen} options={{title: "마이페이지", headerShown: false }} />
            <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ title: "마이 프로필" }} />
            <Stack.Screen name="MemoriesHistory" component={MemoriesHistoryScreen} options={{ title: "추억 조회" }} />
            <Stack.Screen name="Notice" component={NoticeStackNavigator} options={{ title: "공지사항", headerShown: false }} />
            <Stack.Screen name="CustomerServiceStackNavigator" component={CustomerServiceStackNavigator} options={{ title: "고객센터" ,headerShown: false}} />
            {/*<Stack.Screen name="MyInquiries" component={MyInquiriesScreen} options={{ title: "문의" }} />*/}
        </Stack.Navigator>
    );
};

export default MyPageStackNavigator;