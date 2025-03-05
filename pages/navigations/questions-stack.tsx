import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import QuestionsScreen from '../../src/screens/questions/questions-container';

type StackParamList = {
    RandomQuestions: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const RandomQuestionsStack: React.FC = () => {
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
                options={{ title: '랜덤질문' }}
            />
        </Stack.Navigator>
    );
};

export default RandomQuestionsStack;
