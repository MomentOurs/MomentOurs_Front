import { createStackNavigator } from '@react-navigation/stack';
import MainTabsNavigator from './main-tab';
import RandomQuestionsStack from './questions-stack';

const Stack = createStackNavigator();

// 로그인 상태
export default function LoggedInStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabNavigator"
                component={MainTabsNavigator}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="RandomQuestions" component={RandomQuestionsStack} />
        </Stack.Navigator>
    );
}