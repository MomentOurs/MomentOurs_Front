import React from 'react';
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'
import QuestionsScreen from '../../src/screens/questions/questions-container';
import QuestionsRegisterScreen from '../../src/screens/questions/questions-register';
import QuestionCommentScreen from '../../src/screens/questions/questions-comment';
import QuestionsListScreen from '../../src/screens/questions/questions-list';
import QuestionsUpdateScreen from '../../src/screens/questions/questions-update';

type StackParamList = {
    RandomQuestions: undefined;
    QuestionsRegister: undefined;
    QuestionComment: undefined;
    QuestionsList: undefined;
    QuestionsUpdate: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const RandomQuestionsStack = () => {
    return (
        <Stack.Navigator
            {...({ id: undefined } as any)} // 강제로 id 속성 제거
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'white',
                    shadowColor: 'transparent', // iOS 그림자 제거
                    elevation: 0, // 안드로이드 그림자 제거
                },
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'black',
                },
            }}
        >
            <Stack.Screen
            name="RandomQuestions"
            component={QuestionsScreen}
            options={({ navigation }) => ({
                title: '랜덤질문',
                headerBackTitleVisible: false,
                headerLeft: () => null,  
                headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('QuestionsList')}
                    style={{ marginRight: 15 }}
                >
                    <Ionicons name="list" size={24} color="black" />
                </TouchableOpacity>
                ),
            })}
            />
            <Stack.Screen name="QuestionsRegister" component={QuestionsRegisterScreen} />
            <Stack.Screen name="QuestionComment" component={QuestionCommentScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="QuestionsList" component={QuestionsListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="QuestionsUpdate" component={QuestionsUpdateScreen} />

        </Stack.Navigator>
    );
};

export default RandomQuestionsStack;