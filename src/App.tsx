import { NavigationContainer } from '@react-navigation/native';
import LoggedInStack from '../pages/navigations/loggedin-stack';
import LoggedOutStack from '../pages/navigations/loggedout-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);
  // const isLoggedIn = true; // 로그인 여부

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 후에 로딩 완료
        setIsLoggedIn(true);  // 이 부분 주석 처리 해제하면 2초 뒤에 메인 하면으로 전환
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync(); // 스플래시 화면 숨김
      }
    }

    prepare();
  }, []);


  useEffect(() => {
    // AsyncStorage에서 로그인 상태 가져오기
    const checkLoginStatus = async () => {
      try {
        const storedLoginState = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(storedLoginState === 'true'); // 문자열 비교 후 boolean 변환
      } catch (error) {
        console.error('Error loading login state:', error);
      } finally {
        setAppReady(true);
      }
    };

    checkLoginStatus();
  }, []);
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInStack /> : <LoggedOutStack setIsLoggedIn={setIsLoggedIn}/>}
    </NavigationContainer>
    
  );
}
