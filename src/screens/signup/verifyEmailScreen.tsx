    import React, { useState } from 'react';
    import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
    import { StackNavigationProp } from '@react-navigation/stack';
    import { SignUpStackParamList } from '../../components/types/signup/signuptypes';
    import { RouteProp } from '@react-navigation/native';
    import axios from 'axios'; 

    // type SignUpStackParamList = {
    //     SignUp1: undefined;
    //     SignUp2: { email: string; password: string };
    //     SignUp3: {
    //       email: string;
    //       password: string;
    //       name: string;
    //       nickname: string;
    //     };
    //     VerifyEmail: {
    //       email: string;
    //       password: string;
    //       name: string;
    //       nickname: string;
    //       birthDate: string;
    //       selectedGender: string;
    //       mbti: string;
    //     };
    //     LoginScreen: undefined; 
    //   };

    type VerifyEmailNavigationProp = StackNavigationProp<SignUpStackParamList, 'VerifyEmail'>;
    type VerifyEmailRouteProp = RouteProp<SignUpStackParamList, 'VerifyEmail'>;

    interface VerifyEmailScreenProps {
        navigation: VerifyEmailNavigationProp;
        route: VerifyEmailRouteProp;
    }

    const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({ route, navigation }) => {
        const { email, password, name, nickname, birthDate, selectedGender, mbti } = route.params; // 이전 화면에서 받은 이메일
        const [code, setCode] = useState('');
        const [loading, setLoading] = useState(false);

        const handleVerify = async () => {
            setLoading(true);
            try {
                console.log("인증 요청 데이터:", { memberEmail: email });
                const response = await axios.post('http://localhost:8080/api/member/email/send', {
                    member_email: email,
                    // code,
                });

                console.log("서버 응답:", response.data);

                if (response.data.success) {
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
                    } else {
                      Alert.alert('인증 실패', response.data.message || '코드가 올바르지 않습니다.');
                    }
                  } catch (error) {
                    console.error(error);
                    Alert.alert('오류', '서버 오류가 발생했습니다.');
                  } finally {
                    setLoading(false);
                  }
        };

        return (
            <View style={styles.container}>
                <Text style={styles.title}>이메일 인증</Text>
                <Text style={styles.subtitle}>이메일로 받은 인증 코드를 입력하세요.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="인증 코드 입력"
                    keyboardType="numeric"
                    value={code}
                    onChangeText={setCode}
                />
                <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                    <Text style={styles.buttonText}>인증 완료</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFF',
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 16,
            color: '#666',
            marginBottom: 20,
        },
        input: {
            width: '80%',
            height: 50,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 10,
            fontSize: 18,
            marginBottom: 20,
        },
        button: {
            width: '80%',
            height: 50,
            backgroundColor: '#FF9999',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
        },
        buttonText: {
            color: '#FFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    export default VerifyEmailScreen;
