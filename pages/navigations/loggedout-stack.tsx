import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../../src/screens/login/login-container';
import SignUpContainer from '../../src/screens/signup/signup-container';
import FindPasswordScreen from '../../src/screens/login/findPasswordEmailScreen';
import ResetPasswordNavigator from '../../src/screens/login/resetPassword-navigator';

type LoggedOutStackParamList = {
    LoginScreen: undefined;
    SignUpContainer: undefined;
    // FindPasswordScreen: undefined;
    ResetPasswordNavigator: undefined; 
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
            {/* <Stack.Screen
                name="FindPasswordScreen"
                component={FindPasswordScreen}
                options={{ headerShown: false }} 
            /> */}
<Stack.Screen
  name="ResetPasswordNavigator"
  component={ResetPasswordNavigator}
  options={{ headerShown: false }}
/>
        </Stack.Navigator>
    );
}