import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const FindIdScreen: React.FC = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [foundEmail, setFoundEmail] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        const formattedDate = date.toLocaleDateString('sv-SE');
        setBirth(formattedDate);
        hideDatePicker();
    };

    const handleFindId = async () => {
        if (!name || !birth || !inputEmail) {
            Alert.alert('모든 항목을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/member/id', {
                member_name: name,
                member_birth: birth,
                member_email: inputEmail,
            });

            if (response.data.success) {
                const email = response.data.data;
                setFoundEmail(email); 
            } else {
                Alert.alert('찾기 실패', response.data.message || '해당 정보를 가진 회원이 없습니다.');
                setFoundEmail('');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('오류', '아이디 조회 중 오류가 발생했습니다.');
            setFoundEmail('');
        }
    };

    return (
        <View style={styles.container}>
            {/* 상단 배너 */}
            <View style={styles.banner}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>이메일 찾기</Text>
            </View>

            <Text style={styles.subtitle}>회원가입 시 입력한 이름과 생년월일, 이메일을 입력하세요.{'\n'}
                ※ 입력한 이메일이 본인의 계정인지 확인하는 용도입니다.</Text>

            <TextInput
                placeholder="이름"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                placeholder="이메일"
                style={styles.input}
                value={inputEmail}
                onChangeText={setInputEmail}
            />
            <TouchableOpacity onPress={showDatePicker} style={styles.birthInput}>
                <Text style={styles.birthText}>
                    {birth || '생년월일'}
                </Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                maximumDate={new Date()}
            />

            <TouchableOpacity style={styles.button} onPress={handleFindId}>
                <Text style={styles.buttonText}>이메일 찾기</Text>
            </TouchableOpacity>

            {foundEmail !== '' && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultText}>📧 등록된 이메일: {foundEmail}</Text>
                </View>
            )}
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
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    birthInput: {
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        justifyContent: 'center',
    },

    birthText: {
        fontSize: 14,
        color: '#aaa',
    },
    button: {
        height: 50,
        backgroundColor: '#FF9999',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultBox: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fff4f4',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f88',
    },
    resultText: {
        fontSize: 16,
        color: '#f55',
        textAlign: 'center',
    },
});

export default FindIdScreen;
