import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen1 from './signupScreen1';
import SignUpScreen2 from './signupScreen2';
import SignUpScreen3 from './signupScreen3';

// Stack Navigator의 타입 정의
type StackParamList = {
  SignUp1: undefined;
  SignUp2: undefined;
  SignUp3: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const SignUpContainer: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp1" component={SignUpScreen1} />
      <Stack.Screen name="SignUp2" component={SignUpScreen2} />
      <Stack.Screen name="SignUp3" component={SignUpScreen3} />
    </Stack.Navigator>
  );
};

export default SignUpContainer;
