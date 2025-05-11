import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import CustomerServiceScreen from "../../../../pages/home/mypage/customerservice";
import HelpScreen from "../../../../pages/home/mypage/customerservice/help";
import InquiryScreen from "../../../../pages/home/mypage/customerservice/inquiry";
import PolicyScreen from "../../../../pages/home/mypage/customerservice/policy";
import BusinessInformationScreen from "../../../../pages/home/mypage/customerservice/businessinformation";
import OpenSourceLicensceScreen from "../../../../pages/home/mypage/customerservice/opensourcelicense";
import InquiryStackNavigator from "./inquiry-stack-navigator";

type CustomerServiceStackParamList = {
    CustomerService: undefined;
    Help: undefined;
    InquiryStackNavigator: undefined;
    Policy: undefined;
    BusinessInformation: undefined;
    OpenSourceLicense: undefined;
};
const Stack = createStackNavigator<CustomerServiceStackParamList>();

const CustomerServiceStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="CustomerService"
                component={CustomerServiceScreen}
                options={{title: "고객센터"}}
            />
            <Stack.Screen
                name="Help"
                component={HelpScreen}
                options={{ title: "도움말"}}
            />
            <Stack.Screen
                name="InquiryStackNavigator"
                component={InquiryStackNavigator}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name="Policy"
                component={PolicyScreen}
                options={{title: "약관 및 정책"}}
            />
            <Stack.Screen
                name="BusinessInformation"
                component={BusinessInformationScreen}
                options={{title: "사업자 정보"}}
            />
            <Stack.Screen
                name="OpenSourceLicense"
                component={OpenSourceLicensceScreen}
                options={{title: "오픈소스 저작권"}}
            />
        </Stack.Navigator>
    );
};

export default CustomerServiceStackNavigator;