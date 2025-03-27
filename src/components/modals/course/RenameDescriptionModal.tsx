import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface DescriptionModalProps {
    visible: boolean;
    descriptionText: string;
    onChangeText: (text: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

const RenameDescriptionModal: React.FC<DescriptionModalProps> = ({ visible, descriptionText, onChangeText, onClose, onConfirm }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>설명 변경</Text>
                    <TextInput 
                        style={styles.modalInput} 
                        value={descriptionText} 
                        onChangeText={onChangeText} 
                        placeholder="변경할 설명을 입력해 주세요." 
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

export default RenameDescriptionModal;
