import { NavigationContainer } from '@react-navigation/native';
import LoggedInStack from '../pages/navigations/loggedin-stack';
import LoggedOutStack from '../pages/navigations/loggedout-stack';

export default function App() {
  const isLoggedIn = true; // 로그인 여부
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInStack /> : <LoggedOutStack />}
    </NavigationContainer>
  );
}