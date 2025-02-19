import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../src/screens/login/login-container';

const Stack = createStackNavigator();

// 로그아웃 상태
export default function LoggedOutStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}