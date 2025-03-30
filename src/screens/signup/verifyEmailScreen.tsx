import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { SignUpStackParamList } from '../../components/types/signup/signuptypes';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios'; 

type VerifyEmailNavigationProp = StackNavigationProp<SignUpStackParamList, 'VerifyEmail'>;
type VerifyEmailRouteProp = RouteProp<SignUpStackParamList, 'VerifyEmail'>;

interface VerifyEmailScreenProps {
    navigation: VerifyEmailNavigationProp;
    route: VerifyEmailRouteProp;
}

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ route, navigation }) => {
    const { email, password, name, nickname, birthDate, selectedGender, mbti } = route.params; // 이전 화면에서 받은 이메일
    const [code, setCode] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputs = useRef<Array<TextInput | null>>([]);

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) return;
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
    
        if (text && index < 3) {
          inputs.current[index + 1]?.focus();
        }
      };
    
    const handleBackspace = (index: number) => {
        if (index > 0 && code[index] === '') {
          inputs.current[index - 1]?.focus();
        }
      };

    const handleVerify = async () => {
        const joinedCode = code.join('');
        if (joinedCode.length !== 4) {
          Alert.alert('인증 실패', '인증 코드를 정확히 입력해 주세요.');
          return;
        }
    
        setLoading(true);
        try {
          // 1. 인증 코드 검증
            const verifyResponse = await axios.post('http://localhost:8080/api/member/email/verify', {
                member_email: email,
                code: joinedCode,
            });
    
            if (!verifyResponse.data.success) {
                Alert.alert('인증 실패', verifyResponse.data.message || '코드가 올바르지 않습니다.');
                return;
            }
    
          // 2. 회원가입 요청
            const signupResponse = await axios.post('http://localhost:8080/api/member/signup', {
                member_email: email,
                member_password: password,
                member_name: name,
                member_nickname: nickname,
                member_birth: birthDate,
                member_gender: selectedGender,
                member_mbti: mbti,
            });
    
            if (signupResponse.data.success) {
                Alert.alert('🎉 회원가입 성공!', '이제 로그인 해주세요.');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('회원가입 실패', signupResponse.data.message || '에러가 발생했습니다.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('서버 오류', '문제가 발생했습니다.');
        } finally {
            setLoading(false);
        }
      };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          <View style={styles.banner}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>인증 번호 입력</Text>
          </View>
    
          <Text style={styles.subtitle}>회원님의 이메일로 인증 번호가 발송되었어요</Text>
    
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.codeBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') handleBackspace(index);
                }}
                textAlign="center"
              />
            ))}
          </View>
    
          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>인증번호 재전송</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#FFF',
          paddingHorizontal: 20,
          paddingTop: 60,
        },
        banner: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        },
        title: {
          flex: 1,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          transform: [{ translateX: -10 }],
        },
        subtitle: {
          fontSize: 14,
          color: '#666',
          marginBottom: 30,
          textAlign: 'center',
        },
        codeContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        codeBox: {
          width: 60,
          height: 60,
          backgroundColor: '#F5F5F5',
          borderRadius: 8,
          fontSize: 24,
          borderWidth: 1,
          borderColor: '#ccc',
        },
        resendButton: {
          marginBottom: 20,
        },
        resendText: {
          color: '#999',
          textAlign: 'center',
        },
        button: {
          width: '100%',
          height: 50,
          backgroundColor: '#FF9999',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
        },
        buttonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
        },
      });
      

    export default VerifyEmailScreen;
