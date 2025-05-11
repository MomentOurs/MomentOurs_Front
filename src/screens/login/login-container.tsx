import { Text, View, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons"; 
import ResetPasswordNavigator from './resetPassword-navigator';
import axios,  { AxiosError } from 'axios';

// Stack Navigator 타입 정의
type RootStackParamList = {
  Login: undefined;
  SignUpContainer: undefined;
//   FindPasswordScreen: undefined;
ResetPasswordNavigator: undefined;
};

// useNavigation의 타입 정의
type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    setIsLoggedIn: (loggedIn: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRemembered, setIsRemembered] = useState(false);

    const navigation = useNavigation<NavigationProp>(); // 타입 적용

    const toggleRememberMe = () => {
        setIsRemembered((prev) => !prev);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("로그인 실패", "이메일과 비밀번호를 입력해주세요.");
            return;
        }
    
        setLoading(true); // 로딩 시작
        try {
            const response = await axios.post(
                'http://localhost:8080/api/member/login',
                { username: email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            console.log("로그인 성공");
    
            const { accessToken, refreshToken } = response.data;
    
            console.log("Access Token:", accessToken);
            console.log("Refresh Token:", refreshToken);

            await AsyncStorage.setItem('accessToken', accessToken); // JWT 저장
            await AsyncStorage.setItem('refreshToken', refreshToken);

            //  자동로그인 추가
            if (isRemembered) {
                await AsyncStorage.setItem('isLoggedIn', 'true');
            } else {
                await AsyncStorage.removeItem('isLoggedIn');
            }
  
            setIsLoggedIn(true); // 로그인 상태 변경
            // await AsyncStorage.removeItem('isLoggedIn');        // 개발용 코드
    
        } catch (error: unknown) { // unknown 타입을 처리
            if (axios.isAxiosError(error)) {  // AxiosError 여부 확인
                const errorMessage = error.response?.data?.error || "이메일 또는 비밀번호가 올바르지 않습니다.";
                Alert.alert("로그인 실패", errorMessage);
            } else {
                Alert.alert("로그인 실패", "알 수 없는 오류가 발생했습니다.");
            }
    
            console.error("Login Error:", error);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>
                Momentours에 {"\n"}오신걸 환영해요!
            </Text>
            <TextInput 
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#7B7B7B"
                style={styles.input} 
                autoCapitalize="none" // 첫 글자 대문자 방지
            />
            <TextInput 
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#7B7B7B"
                secureTextEntry
                style={styles.input} 
                autoCapitalize="none" // 첫 글자 대문자 방지
            />
            <TouchableOpacity style={styles.checkboxContainer} onPress={toggleRememberMe}>
                <View style={[styles.checkbox, { backgroundColor: isRemembered ? "black" : "white", borderColor: isRemembered ? "black" : "gray" }]}>
                    {isRemembered && <Ionicons name="checkmark" size={14} color="white" />}
                </View>
                <Text style={styles.loginRemember}>로그인 유지</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SignUpContainer')}>
                    <Text style={styles.linkText}>회원가입</Text>
                </TouchableOpacity>
                <Text style={styles.separator}> | </Text>
                {/* <TouchableOpacity onPress={() => alert('아이디 찾기 페이지 이동')}>
                    <Text style={styles.linkText}>아이디찾기</Text>
                </TouchableOpacity> */}
                {/* <Text style={styles.separator}> | </Text> */}
                {/* <TouchableOpacity onPress={() => alert('비밀번호 찾기 페이지 이동')}> */}
                {/* <TouchableOpacity onPress={() => navigation.navigate('FindPasswordScreen')}>
                    <Text style={styles.linkText}>비밀번호찾기</Text>
                </TouchableOpacity> */}
                
                <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordNavigator')}>
                    <Text style={styles.linkText}>비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                    <Text style={styles.socialLoginText}>간편로그인</Text>
                <View style={styles.line} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 32, 
        marginTop: 60,
        marginBottom: 60,        
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 10,
        textAlignVertical: 'center',
    },
    loginRemember: {
        fontSize: 14,
        color: '#666',
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#FF9999',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    linkText: {
        fontSize: 14,
        color: '#666',
        paddingVertical: 5,
    },
    separator: {
        fontSize: 14,
        color: '#ccc',
        marginHorizontal: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    checkboxContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row', 
        alignItems: 'center',  
        width: '90%',
        marginTop: 50,
        marginBottom: 15, 
    },
    line: {
        flex: 1,  
        height: 1, 
        backgroundColor: '#ddd',  
    },
    socialLoginText: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 10, 
    },
});

export default LoginScreen;
