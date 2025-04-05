import { Text, View, SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

interface LoginScreenProps {
    setIsLoggedIn: (loggedIn: boolean) => void;
}

const LoginScreen = ({ setIsLoggedIn } : LoginScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if ( email == 'example@example.com' && password=='1234') {
            setIsLoggedIn(true);
        } 
        else {
            alert('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
    }
    return (
        // <View style={{
        //     flex: 1,
        //     alignItems: 'center',
        //     justifyContent: 'center',
        // }}>
        //     <Text>Login Screen</Text>
        // </View>
        <SafeAreaView style={styles.container}>
            <Text style={styles.title} >Momentours에
                오신걸 환영해요!
            </Text>
            <TextInput 
                placeholder='이메일'
                value={email}
                onChangeText={setEmail}
                placeholderTextColor='#7B7B7B'
                style={styles.input} 
            />
            <TextInput 
                placeholder='비밀번호'
                value={password}
                onChangeText={setPassword}
                placeholderTextColor='#7B7B7B'
                style={styles.input} 
            />
            <TouchableOpacity>
                <Text style={styles.loginRemember}>로그인 유지</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>

            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 32, 
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
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
}) 
export default LoginScreen;