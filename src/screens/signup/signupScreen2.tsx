import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Stack Navigator의 타입 정의
type SignUpStackParamList = {
    SignUp1: undefined;
    SignUp2: undefined;
    SignUp3: undefined;
  };

// navigation의 타입 정의
type SignUpScreen2NavigationProp = StackNavigationProp<SignUpStackParamList, 'SignUp2'>;

// Props 타입 정의
interface SignUpScreen2Props {
  navigation: SignUpScreen2NavigationProp;
}

const SignUpScreen2: React.FC<SignUpScreen2Props> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    
    return (
        <View style={styles.container}>
            {/* 상단 배너 (뒤로가기 + 회원가입 타이틀) */}
            <View style={styles.banner}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>회원가입</Text>
            </View>

            {/* 진행 상태바 (2/3 진행) */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarFill} />
            </View>

            {/* 안내 문구 */}
            <View style={styles.content}>
                <Text style={styles.subtitle}>회원가입을 위해 필요한 정보를 입력해 주세요.</Text>

                <Text style={styles.label}>이름</Text>
                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="이름을 입력해 주세요" 
                        placeholderTextColor="#aaa" 
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <Text style={styles.label}>닉네임</Text>
                <View style={styles.inputRow}>  
                    <TextInput 
                        style={styles.input} 
                        placeholder="닉네임을 입력해주세요" 
                        placeholderTextColor="#aaa"
                        value={nickname}
                        onChangeText={setNickname}
                    />
                    <TouchableOpacity style={styles.checkButton}>
                        <Text style={styles.checkButtonText}>중복 확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* 계속하기 버튼 */}
            <TouchableOpacity 
                style={styles.nextButton} 
                onPress={() => navigation.navigate('SignUp3')}
            >
                <Text style={styles.nextButtonText}>계속하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',  
        paddingHorizontal: 20,
    },
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 10,
      },
      backButton: {},
      title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        transform: [{ translateX: -10 }],  
      },
        /* 진행 상태바 스타일 */
    progressBarContainer: {
        width: '100%',
        height: 3,
        backgroundColor: '#FFDADA', 
        marginBottom: 20,
    },
    progressBarFill: {
        width: '66.6%', // 2/3 진행
        height: '100%',
        backgroundColor: '#FF9999',
    },
    content: {
        flex: 1, 
        justifyContent: 'flex-start', 
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
        marginBottom: 50,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        flex: 1, 
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', 
        justifyContent: 'space-between', 
        marginBottom: 30, 
    },
    checkButton: {
        backgroundColor: '#FF9999',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        height: 50, 
        marginLeft: 10, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    nextButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FF9999',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 30,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignUpScreen2;