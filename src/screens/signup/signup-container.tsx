  import React from 'react';
  import { createStackNavigator } from '@react-navigation/stack';
  import SignUpScreen1 from './signupScreen1';
  import SignUpScreen2 from './signupScreen2';
  import SignUpScreen3 from './signupScreen3';
  import VerifyEmailScreen from './verifyEmailScreen';
  import { SignUpStackParamList } from '../../components/types/signup/signuptypes'; 

  // Stack Navigator의 타입 정의
  // type StackParamList = {
  //   SignUp1: { email: string };
  //   SignUp2: { email: string };
  //   SignUp3: { email: string };
  //   VerifyEmail: { email: string };
  // };

  const Stack = createStackNavigator<SignUpStackParamList>(); 
  // const Stack = createStackNavigator<StackParamList>();

  const SignUpContainer: React.FC = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp1" component={SignUpScreen1} />
        <Stack.Screen name="SignUp2" component={SignUpScreen2} />
        <Stack.Screen name="SignUp3" component={SignUpScreen3} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} /> 
      </Stack.Navigator>
    ); 
  };

  export default SignUpContainer;
