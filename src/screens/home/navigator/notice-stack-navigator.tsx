import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NoticeListScreen from "../../../../pages/home/mypage/notice/list";
import NoticeDetailScreen from "../../../../pages/home/mypage/notice/detail";

const Stack = createStackNavigator();

const NoticeStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="NoticeList" 
                component={NoticeListScreen} 
                options={{ title: "공지사항" }} 
            />
            <Stack.Screen 
                name="NoticeDetail" 
                component={NoticeDetailScreen} 
                options={{ title: "상세 내용" }} 
            />
        </Stack.Navigator>
    );
};

export default NoticeStackNavigator;