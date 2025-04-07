import { createStackNavigator } from '@react-navigation/stack';
import FindPasswordScreen from './findPasswordEmailScreen';
import VerifyPasswordScreen from './verifyPasswordScreen';
import ChangePasswordScreen from './changePasswordScreen';


export type ResetPasswordStackParamList = {
  FindPasswordScreen: undefined;
  VerifyPassword: { email: string };
  ChangePassword: { email: string };
};

const Stack = createStackNavigator<ResetPasswordStackParamList>();

const ResetPasswordNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FindPasswordScreen" component={FindPasswordScreen} />
      <Stack.Screen name="VerifyPassword" component={VerifyPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default ResetPasswordNavigator;
