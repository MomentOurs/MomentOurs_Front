import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { ResetPasswordStackParamList } from './resetPassword-navigator';
import axios from 'axios';

// props 타입 정의
type ChangePasswordProps = StackScreenProps<ResetPasswordStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC<ChangePasswordProps> = ({ route, navigation }) => {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새 비밀번호 설정</Text>
      <TextInput
        style={styles.input}
        placeholder="새 비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: '#FF9999',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;