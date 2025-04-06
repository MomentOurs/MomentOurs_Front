import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { SignUpStackParamList } from '../../components/types/signup/signuptypes';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios'; 

// navigation의 타입 정의
type SignUpScreen2NavigationProp = StackNavigationProp<SignUpStackParamList, 'SignUp2'>;
type SignUpScreen2RouteProp = RouteProp<SignUpStackParamList, 'SignUp2'>;

// Props 타입 정의
interface SignUpScreen2Props {
  navigation: SignUpScreen2NavigationProp;
  route: SignUpScreen2RouteProp;
}

const SignUpScreen2: React.FC<SignUpScreen2Props> = ({ navigation, route }) => {
    const { email, password } = route.params;
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false); 
    const isFormValid = name.trim() !== '' && isNicknameChecked;


    const handleCheckNickname = async () => {
        if (!nickname) {
            Alert.alert("오류", "닉네임을 입력해주세요.");
            return;
        }

        try {
            console.log("닉네임 중복 확인 요청:", { memberNickname: nickname });

            const response = await axios.get(`http://localhost:8080/api/member/check-nickname`, {
                params: { memberNickname: nickname }
            });

            console.log("서버 응답:", response.data);

            Alert.alert("결과", response.data.data);

            if (response.data.data === "사용할 수 있는 닉네임입니다.") {
                setIsNicknameChecked(true); 
            } else {
                setIsNicknameChecked(false); 
            }
        } catch (error) {
            console.error("닉네임 중복 확인 오류:", error);
            Alert.alert("오류", "서버 오류가 발생했습니다.");
        }
    };
    
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
                    <TouchableOpacity 
                        style={[styles.checkButton, isNicknameChecked && styles.disabledButton]} 
                        onPress={handleCheckNickname} 
                        disabled={isNicknameChecked} // 중복 확인 완료 시 비활성화
                    >
                        <Text style={styles.checkButtonText}>중복 확인</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* 계속하기 버튼 */}
            <TouchableOpacity 
                style={[
                    styles.nextButton, 
                    !isFormValid ? styles.disabledButton : null
                ]}
                onPress={() => navigation.navigate('SignUp3', {
                    email,
                    password,
                    name,
                    nickname
                })}
                disabled={!isFormValid}
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
    disabledButton: {
        backgroundColor: '#ccc', 
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