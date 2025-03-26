import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import ClendarScreen from '../clendar';
import QuestionsScreen from '../questions/index';
import HomeScreen from '../home';
import CourseScreen from '../course';
import MapScreen from '../map';

const Tab = createBottomTabNavigator();

// 🔹 탭 네비게이터 (하단 바)
const MainTabsNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="랜덤질문" component={QuestionsScreen} options={{ headerShown: false }}/>
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Clendar" component={ClendarScreen} />
            <Tab.Screen name="Course" component={CourseScreen} />
        </Tab.Navigator>
    );
};

export default MainTabsNavigator;
