import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../home/index";
import SettingModal from "../../src/screens/home/setting-modal";

type HomeStackParamList = {
    Home: undefined;
    Settings: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Settings" component={SettingModal} options={{ title: "설정" }} />
        </Stack.Navigator>
    );
};

export default HomeStackNavigator;