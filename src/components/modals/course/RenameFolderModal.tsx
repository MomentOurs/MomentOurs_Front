import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface RenameFolderModalProps {
    visible: boolean;
    folderName: string;
    renameText: string;
    onChangeText: (text: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const RenameFolderModal: React.FC<RenameFolderModalProps> = ({ visible, folderName, renameText, onChangeText, onClose, onConfirm }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{folderName}{'\n'}폴더명 변경</Text>
                    <TextInput 
                        style={styles.modalInput} 
                        value={renameText} 
                        onChangeText={onChangeText} 
                        placeholder="변경할 이름을 입력해 주세요." 
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                            <Text style={styles.modalCancelText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalConfirmButton} onPress={onConfirm}>
                            <Text style={styles.modalConfirmText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
    },
    modalCancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 10,
    },
    modalCancelText: {
        color: '#888',
        fontSize: 16,
    },
    modalConfirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#FF6F61',
        borderRadius: 5,
    },
    modalConfirmText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RenameFolderModal;
