import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoggedInStack from '../pages/navigations/loggedin-stack';
import LoggedOutStack from '../pages/navigations/loggedout-stack';

export default function App() {
  const isLoggedIn = true;
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInStack /> : <LoggedOutStack />}
    </NavigationContainer>
  );
}
