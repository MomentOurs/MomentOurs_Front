// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// const FindPasswordEmailScreen = ({ navigation }) => {
//   const [email, setEmail] = useState('');

//   const handleSendCode = async () => {
//     if (!email.trim()) {
//       Alert.alert('오류', '이메일을 입력해주세요.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8080/api/member/password/send-code', {
//         email,
//       });

//       if (response.data.success) {
//         Alert.alert('성공', '인증번호가 이메일로 전송되었습니다.');
//         navigation.navigate('VerifyCodeScreen', { email });
//       } else {
//         Alert.alert('실패', response.data.message || '인증번호 전송 실패');
//       }
//     } catch (error) {
//       Alert.alert('에러', '서버 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>비밀번호를 잊으셨나요?</Text>
//       <Text style={styles.description}>비밀번호를 찾기 위해 이메일을 입력해주세요.</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="이메일 입력"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSendCode}>
//         <Text style={styles.buttonText}>확인</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24, justifyContent: 'center' },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   description: { fontSize: 14, color: '#666', marginBottom: 20 },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
//   button: { backgroundColor: '#f99', padding: 15, borderRadius: 8 },
//   buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
// });

// export default FindPasswordEmailScreen;
