import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import InquiryScreen from "../../../../pages/home/mypage/customerservice/inquiry";
import InquiryRequestScreen from "../../../../pages/home/mypage/customerservice/inquiry/request";
import InquiryListStackNavigator from "./inquiry-list-stack-navigator";

type InquiryStackParamList = {
    Inquiry: undefined;
    InquiryRequest: undefined;
    InquiryHistoryListStack: undefined;
}
const Stack = createStackNavigator<InquiryStackParamList>();

const InquiryStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Inquiry"
                component={InquiryScreen}
                options={{title: "문의"}}
            />
            <Stack.Screen
                name="InquiryRequest"
                component={InquiryRequestScreen}
                options={{title: "1:1 문의하기"}}
            />
            <Stack.Screen
                name="InquiryHistoryListStack"
                component={InquiryListStackNavigator}
                options={{headerShown:false}}
            />
        </Stack.Navigator>
    );
};

export default InquiryStackNavigator;