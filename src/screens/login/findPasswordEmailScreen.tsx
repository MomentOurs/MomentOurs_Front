import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
// import ResetPasswordNavigator from './resetPassword-Navigator';
// import { ResetPasswordStackParamList } from './resetPassword-Navigator';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';

// 이 화면에서만 사용할 StackParamList 정의
// type FindPasswordStackParamList = {
//   FindPasswordScreen: undefined;
//   ChangePassword: { email: string };
//   VerifyPassword: { email: string };
//   LoginScreen: undefined;
// };
export type ResetPasswordStackParamList = {
  FindPasswordScreen: undefined;
  VerifyPassword: { email: string };
  ChangePassword: { email: string };
};

type Props = StackScreenProps<ResetPasswordStackParamList, 'FindPasswordScreen'>;

const FindPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('이메일을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/member/email/send', 
      { 
        member_email: email 
    });

      if (response.data.success) {
        Alert.alert('인증 메일 발송', '이메일을 확인하고 인증 코드를 입력해주세요.');
        navigation.navigate('VerifyPassword', { email });
      } else {
        Alert.alert('전송 실패', response.data.message || '이메일 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('서버 오류', '이메일 전송 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 배너 (뒤로가기 + 타이틀) */}
      <View style={styles.banner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 찾기</Text>
      </View>

      {/* 안내 문구 */}
      <Text style={styles.subtitle}>비밀번호를 찾기 위해 이메일을 입력해 주세요.</Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="이메일을 입력하세요"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>

      {/* 하단 로그인 링크 */}
      <View style={styles.footerWrapper}>
        <Text style={styles.footerText}>
        비밀번호를 기억하시나요?{' '}
        <Text
          style={styles.linkText}
          onPress={() =>
          navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
            })
            )
          }
        >
        로그인 바로가기
      </Text>
      </Text>
      </View>
    </View>
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 50,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
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
  footerWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
  },
  linkText: {
    color: '#f88',
    fontWeight: 'bold',
  },
});

export default FindPasswordScreen;
