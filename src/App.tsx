import { NavigationContainer } from '@react-navigation/native';
import LoggedInStack from '../pages/navigations/loggedin-stack';
import LoggedOutStack from '../pages/navigations/loggedout-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appReady, setAppReady] = useState(false);
  // const isLoggedIn = true; // 로그인 여부

  // 로그인 유지 시 asyncstorage 삭제하기 위한 코드 
  // useEffect(() => {
  //   const clearAsyncStorage = async () => {
  //     try {
  //       await AsyncStorage.clear(); // 개발 중 자동로그인 방지
  //       console.log('AsyncStorage 초기화 완료');
  //     } catch (error) {
  //       console.warn('초기화 실패:', error);
  //     }
  //   };
  
  //   clearAsyncStorage(); 
  // }, []);

  useEffect(() => {
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('위치 권한이 거부되었습니다.');
    }
  };

  requestLocationPermission();
}, []);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedLoginState = await AsyncStorage.getItem('isLoggedIn');
        setIsLoggedIn(storedLoginState === 'true');
      } catch (error) {
        console.error('Error loading login state:', error);
      } finally {
        setAppReady(true);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
  const clearAsyncStorageForDev = async () => {
    try {
      const isFirstRun = await AsyncStorage.getItem('DEV_FIRST_CLEAR');
      if (!isFirstRun) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('DEV_FIRST_CLEAR', 'done');
        console.log('✅ AsyncStorage 초기화 완료');
      }
    } catch (error) {
      console.warn('초기화 실패:', error);
    }
  };

  clearAsyncStorageForDev();
}, []);

  return (
    <SafeAreaProvider>
    <NavigationContainer>
      {isLoggedIn ? <LoggedInStack /> : <LoggedOutStack setIsLoggedIn={setIsLoggedIn}/>}
    </NavigationContainer>
    </SafeAreaProvider>
  );
}