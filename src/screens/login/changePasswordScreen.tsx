import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { ResetPasswordStackParamList } from './resetPassword-navigator';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

type ChangePasswordProps = StackScreenProps<ResetPasswordStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC<ChangePasswordProps> = ({ route, navigation }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:8080/api/member/password',
        {
          member_email: email,
          member_password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.success) {
        Alert.alert('비밀번호 변경 완료', '다시 로그인 해주세요.');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        );
      } else {
        Alert.alert('오류', data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('서버 오류', '비밀번호 변경 중 문제가 발생했습니다.');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordMatch(text === password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>비밀번호 재설정</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>새 비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="8~16자의 영문, 숫자, 특수기호"
          secureTextEntry
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          placeholder="8~16자의 영문, 숫자, 특수기호"
          secureTextEntry
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />

        {passwordMatch !== null && (
          <Text style={{ color: passwordMatch ? 'green' : 'red', marginBottom: 20 }}>
            {passwordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, (!password || !passwordMatch) && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!password || !passwordMatch}
      >
        <Text style={styles.buttonText}>비밀번호 변경</Text>
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
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF9999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ChangePasswordScreen;
