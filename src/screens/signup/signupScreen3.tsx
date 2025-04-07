import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { SignUpStackParamList } from '../../components/types/signup/signuptypes';
import { RouteProp } from '@react-navigation/native';
import axios from 'axios';

// navigation의 타입 정의
type SignUpScreen3NavigationProp = StackNavigationProp<SignUpStackParamList, 'SignUp3'>;
type SignUpScreen3RouteProp = RouteProp<SignUpStackParamList, 'SignUp3'>;

// Props 타입 정의
interface SignUpScreen3Props {
  navigation: SignUpScreen3NavigationProp;
  route: SignUpScreen3RouteProp;
}

const SignUpScreen3: React.FC<SignUpScreen3Props> = ({ navigation, route }) => {
    const { email, password, name, nickname } = route.params;
    const [birthDate, setBirthDate] = useState('');
    const [selectedGender, setSelectedGender] = useState<'여성' | '남성' | null>(null);
    const [mbti, setMbti] = useState('');
    const isFormValid = birthDate.trim() !== '' && selectedGender !== null;


    const handleSendEmail = async () => {
        try {
            console.log("📢 이메일 인증 코드 요청 데이터:", { memberEmail: email });
    
            const response = await axios.post(
                'http://localhost:8080/api/member/email/send',
                { member_email: email },
                { headers: { 'Content-Type': 'application/json' } } // 헤더 추가
            );
    
            console.log("서버 응답:", response.data);
    
            if (response.data?.success) {
                Alert.alert('성공', '이메일로 인증 코드가 발송되었습니다.');
                navigation.navigate('VerifyEmail', { email, password, name, nickname, birthDate, selectedGender: selectedGender ?? '', mbti });
            } else {
                Alert.alert('⚠️ 오류', response.data.message);
            }
        } catch (error) {
            console.error("이메일 인증 코드 요청 실패:", error);
            Alert.alert('오류', '서버 오류가 발생했습니다.');
        }
    };
    

    return( 
        <View style={styles.container}>
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
                <Text style={styles.subtitle}>회원가입이 거의 완료됐어요!</Text>

                <Text style={styles.label}>생년월일</Text>
                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="생년월일을 입력해 주세요" 
                        placeholderTextColor="#aaa" 
                        value={birthDate}
                        onChangeText={setBirthDate}
                    />
                </View>

                <Text style={styles.label}>성별</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity 
                        style={[styles.genderButton, selectedGender === '여성' && styles.selectedGender]} 
                        onPress={() => setSelectedGender('여성')}
                    >
                        <Text style={[styles.genderText, selectedGender === '여성' && styles.selectedText]}>여성</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.genderButton, selectedGender === '남성' && styles.selectedGender]} 
                        onPress={() => setSelectedGender('남성')}
                    >
                        <Text style={[styles.genderText, selectedGender === '남성' && styles.selectedText]}>남성</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.label}>MBTI</Text>
                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="MBTI를 알려 주세요" 
                        placeholderTextColor="#aaa" 
                        value={mbti}
                        onChangeText={setMbti}
                    />
                </View>
            </View>
            {/* <TouchableOpacity style={styles.nextButton} onPress={() => alert('회원가입 완료')}>
                <Text style={styles.nextButtonText}>회원가입 완료</Text>
            </TouchableOpacity> */}
<TouchableOpacity 
  style={[styles.nextButton, !isFormValid && styles.disabledButton]}
  onPress={handleSendEmail}
  disabled={!isFormValid}
>
  <Text style={styles.nextButtonText}>회원가입 완료</Text>
</TouchableOpacity>
        </View>
)}

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
    progressBarContainer: {
        width: '100%',
        height: 3,
        backgroundColor: '#FFDADA', 
        marginBottom: 20,
    },
    progressBarFill: {
        width: '100%', // 3/3 진행
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
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 5,
    },
    selectedGender: {
        backgroundColor: '#FF9999',
        borderColor: '#FF9999',
    },
    genderText: {
        fontSize: 14,
        color: '#666',
    },
    selectedText: {
        color: 'white',
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
    disabledButton: {
        backgroundColor: '#ccc',
      },
})

export default SignUpScreen3;