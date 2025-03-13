import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../src/screens/login/login-container';
import SignUpContainer from '../../src/screens/signup/signup-container';

type LoggedOutStackParamList = {
    LoginScreen: undefined;
    SignUpContainer: undefined;
};

const Stack = createStackNavigator<LoggedOutStackParamList>();

export default function LoggedOutStack({ setIsLoggedIn }: { setIsLoggedIn: (loggedIn: boolean) => void }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="LoginScreen"
                options={{ headerShown: false }}
            >
                {() => <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen 
                name="SignUpContainer" 
                component={SignUpContainer} 
                options={{ headerShown: false }} 
            />
        </Stack.Navigator>
    );
}