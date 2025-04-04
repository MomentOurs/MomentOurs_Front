import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CourseLocationDeleteModalProps {
    visible: boolean;
    selectedCount: number;
    onClose: () => void;
    onConfirm: () => void;
}

const CourseLocationDeleteModal: React.FC<CourseLocationDeleteModalProps> = ({
    visible,
    selectedCount,
    onClose,
    onConfirm,
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {selectedCount > 1
                            ? `${selectedCount}개의 장소를 정말 삭제하시겠습니까?`
                            : `선택한 장소를 정말 삭제하시겠습니까?`}
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
        padding: 24,
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

export default CourseLocationDeleteModal;
