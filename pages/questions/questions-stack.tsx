import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuestionsScreen from '../../src/screens/questions/questions-container';
import QuestionsRegisterScreen from '../../src/screens/questions/questions-register';
import QuestionCommentScreen from '../../src/screens/questions/questions-comment';


type StackParamList = {
    RandomQuestions: undefined;
    QuestionsRegister: undefined;
    QuestionComment: undefined;
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
            />
            <Stack.Screen name="QuestionsRegister" component={QuestionsRegisterScreen} />
            <Stack.Screen name="QuestionComment" component={QuestionCommentScreen} />

        </Stack.Navigator>
    );
};

export default RandomQuestionsStack;