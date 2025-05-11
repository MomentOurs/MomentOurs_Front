import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 뒤로가기 아이콘 사용
import { StackNavigationProp } from '@react-navigation/stack';
import { SignUpStackParamList } from '../../components/types/signup/signuptypes';
import axios from 'axios'; 

// Stack Navigator의 타입 정의
// type SignUpStackParamList = {
//   SignUp1: undefined;
//   SignUp2: { email: string; password: string };
//   SignUp3: {
//     email: string;
//     password: string;
//     name: string;
//     nickname: string;
//   };
//   VerifyEmail: {
//     email: string;
//     password: string;
//     name: string;
//     nickname: string;
//     birthDate: string;
//     selectedGender: string;
//     mbti: string;
//   };
//   LoginScreen: undefined;
// };
// navigation의 타입 정의
type SignUpScreen1NavigationProp = StackNavigationProp<SignUpStackParamList, 'SignUp1'>;

// Props 타입 정의
interface SignUpScreen1Props {
  navigation: SignUpScreen1NavigationProp;
}

const SignUpScreen1: React.FC<SignUpScreen1Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [isEmailChecked, setIsEmailChecked] = useState(false);  // 중복확인 여부
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [confirmPassword, setConfirmPassword] = useState('');

  
const checkEmail = async () => {
    if (!email.trim()) {
        Alert.alert("오류", "이메일을 입력해주세요.");
        return;
    }

    try {
        console.log("이메일 중복 확인 요청:", email);

        const response = await axios.get(`http://localhost:8080/api/member/check-email`, {
            params: { memberEmail: email }
        });

        console.log("백엔드 응답 데이터:", response.data);

        if (response.data && response.data.success) {
            Alert.alert("결과", response.data.data);

            if (response.data.data === "사용할 수 있는 이메일입니다.") {
                setIsEmailChecked(true); // 중복 확인 완료 시 비활성화
            }
        } else {
            Alert.alert("오류", "서버에서 예상치 못한 응답이 왔습니다.");
        }
    } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        Alert.alert("오류", "서버 오류가 발생했습니다.");
    }
};

const handleConfirmPasswordChange = (text: string) => {
  setConfirmPassword(text);
  setPasswordMatch(text === password);
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

      {/* 진행 상태바 (1/3 진행) */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarFill} />
      </View>

      {/* 안내 문구 */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>회원가입을 위해 필요한 정보를 입력해 주세요.</Text>

        <Text style={styles.label}>이메일</Text>
        <View style={styles.inputRow}>
        <TextInput 
            style={styles.input} 
            placeholder="이메일 주소를 입력해 주세요" 
            placeholderTextColor="#aaa" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" 
            editable={!isEmailChecked} 
          />
          <TouchableOpacity 
            style={[styles.checkButton, isEmailChecked && styles.disabledButton]} 
            onPress={checkEmail} 
            disabled={isEmailChecked}
          >
            <Text style={styles.checkButtonText}>
              {isEmailChecked ? "확인 완료" : "중복 확인"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.inputRow}>  
          <TextInput 
            style={styles.input} 
            placeholder="8~16자의 영문, 숫자, 특수기호" 
            secureTextEntry 
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Text style={styles.label}>비밀번호 확인</Text>
        <View style={styles.inputRow}>  
          <TextInput 
            style={styles.input} 
            placeholder="8~16자의 영문, 숫자, 특수기호" 
            secureTextEntry 
            placeholderTextColor="#aaa" 
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
        </View>
        {passwordMatch !== null && (
        <Text style={{ color: passwordMatch ? 'green' : 'red', marginTop: -20, marginBottom: 20 }}>
          {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
        </Text>
)}
      </View>

      {/* 계속하기 버튼 */}
      <TouchableOpacity 
        style={[
          styles.nextButton, 
          (!isEmailChecked || !passwordMatch) && styles.disabledButton
        ]}
        onPress={() => navigation.navigate('SignUp2', { email, password })}
        disabled={!isEmailChecked || !passwordMatch}
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
  content: {
    flex: 1, 
    justifyContent: 'flex-start', 
  },
  /* 상단 배너 스타일 */
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
    width: '33.3%', // 1/3 진행
    height: '100%',
    backgroundColor: '#FF9999',
  },
  /* 본문 스타일 */
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
  /* 입력 필드 스타일 */
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
  /* 계속하기 버튼 */
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

export default SignUpScreen1;
