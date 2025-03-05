import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import ClendarScreen from '../clendar';
import QuestionsScreen from '../questions';
import HomeScreen from '../home';
import CourseScreen from '../course';
import MapScreen from '../map';

const Tab = createBottomTabNavigator();

// 🔹 랜덤질문 화면의 상단 아이콘
const HeaderLeftIcon = ({ navigation }) => (
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
        <Ionicons name="chevron-back-outline" size={22} color="black" />
    </TouchableOpacity>
);

const HeaderRightIcon = ({ navigation }) => (
    <TouchableOpacity onPress={() => console.log('목록 버튼 클릭')} style={{ marginRight: 15 }}>
        <Ionicons name="menu-outline" size={22} color="black" />
    </TouchableOpacity>
);

// 🔹 탭 네비게이터 (하단 바)
const MainTabsNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen 
                name="랜덤질문" 
                component={QuestionsScreen}
                options={({ navigation }) => ({
                    headerTitle: '랜덤질문',
                    headerTitleAlign: 'center',
                    headerStyle: { backgroundColor: 'white' },
                    headerTitleStyle: { fontSize: 18, fontWeight: 'bold', color: 'black' },
                    headerLeft: () => <HeaderLeftIcon navigation={navigation} />,
                    headerRight: () => <HeaderRightIcon navigation={navigation} />,
                })}
            />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Clendar" component={ClendarScreen} />
            <Tab.Screen name="Course" component={CourseScreen} />
        </Tab.Navigator>
    );
};

export default MainTabsNavigator;
