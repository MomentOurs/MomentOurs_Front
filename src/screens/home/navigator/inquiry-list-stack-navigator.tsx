import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import InquiryHistoryScreen from "../../../../pages/home/mypage/customerservice/inquiry/history";
import InqiuryDetailScreen from "../../../../pages/home/mypage/customerservice/inquiry/detail";

const Stack = createStackNavigator();

const InquiryListStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="InquiryHistoryList" 
                component={InquiryHistoryScreen} 
                options={{  title: "문의 내역" }} 
            />
            <Stack.Screen 
                name="InquiryHistoryDetail" 
                component={InqiuryDetailScreen} 
                options={{ title: "상세 내용" }} 
            />
        </Stack.Navigator>
    );
};

export default InquiryListStackNavigator;