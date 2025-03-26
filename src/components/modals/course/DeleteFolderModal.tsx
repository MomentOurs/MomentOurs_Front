import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DeleteFolderModalProps {
    visible: boolean;
    folderName: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteFolderModal: React.FC<DeleteFolderModalProps> = ({ visible, folderName, onClose, onConfirm }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        "{folderName}"
                        {'\n'}
                        폴더를 정말 삭제하시겠습니까?
                    </Text>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
                            <Text style={styles.modalCancelText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalConfirmButton} onPress={onConfirm}>
                            <Text style={styles.modalConfirmText}>삭제</Text>
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
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
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
        justifyContent: 'center',
    },
    modalCancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    modalCancelText: {
        color: '#666',
        fontSize: 14,
    },
    modalConfirmButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FF6F61',
        borderRadius: 5,
    },
    modalConfirmText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default DeleteFolderModal;
