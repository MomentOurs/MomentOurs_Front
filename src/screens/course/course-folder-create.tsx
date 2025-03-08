import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CourseFolderCreate = () => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();

    const [folderTitle, setFolderTitle] = useState('');
    const [folderDescription, setFolderDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!folderTitle.trim()) {
            alert('폴더 제목을 입력해주세요.');
            return;
        }
    
        setIsSaving(true);
    
        setTimeout(() => {
            console.log('폴더 저장:', { folderTitle, folderDescription });
    
            navigation.navigate('CourseHome', { refresh: true });
        }, 1000);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.imagePicker}>
                    <Image source={require('../../../assets/image-placeholder.png')} style={styles.image} />
                </View>
            
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="폴더 제목"
                        placeholderTextColor="#aaa"
                        value={folderTitle}
                        onChangeText={setFolderTitle}
                    />
            
                    <TextInput
                        style={[styles.input, styles.descriptionInput]}
                        placeholder="폴더 정보를 입력해 주세요."
                        placeholderTextColor="#aaa"
                        value={folderDescription}
                        onChangeText={setFolderDescription}
                        multiline
                    />
                </View>
            </View>
            
            <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
            >
                <Text style={styles.saveButtonText}>{isSaving ? '저장 중...' : '저장하기'}</Text>
            </TouchableOpacity>
        </View>
    );    
};

const styles = StyleSheet.create({
    backButton: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    imagePicker: {
        width: 150,
        height: 150,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
    },
    inputContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
    },
    input: {
        fontSize: 16,
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 20,
    },
    descriptionInput: {
        height: 60,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#E0E0E0',
    },
});

export default CourseFolderCreate;
