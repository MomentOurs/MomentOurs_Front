import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyPageScreen from "../../../../pages/home/mypage";
import MyProfileScreen from "../../../../pages/home/mypage/myprofile";
import MemoriesHistoryScreen from "../../../../pages/home/mypage/memorieshistory";
import NoticeScreen from "../../../../pages/home/mypage/notice";
import CustomerServiceScreen from "../../../../pages/home/mypage/customerservice";
import MyInquiriesScreen from "../../../../pages/home/mypage/myinquiries";


type MyPageStackParamList = {
    MyPage: undefined;
    MyProfile: undefined;
    MemoriesHistory: undefined;
    Notice: undefined;
    CustomerService: undefined;
    MyInquiries: undefined;
};

const Stack = createStackNavigator<MyPageStackParamList>();

const MyPageStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MyPage" component={MyPageScreen} options={{title: "마이페이지", headerShown: false }} />
            <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{ title: "마이 프로필" }} />
            <Stack.Screen name="MemoriesHistory" component={MemoriesHistoryScreen} options={{ title: "추억 조회" }} />
            <Stack.Screen name="Notice" component={NoticeScreen} options={{ title: "공지사항" }} />
            <Stack.Screen name="CustomerService" component={CustomerServiceScreen} options={{ title: "고객센터" }} />
            <Stack.Screen name="MyInquiries" component={MyInquiriesScreen} options={{ title: "문의 내역" }} />
        </Stack.Navigator>
    );
};

export default MyPageStackNavigator;