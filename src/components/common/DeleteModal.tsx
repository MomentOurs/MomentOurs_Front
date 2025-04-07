import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal
} from 'react-native';

interface DeleteModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isVisible, onClose, onDelete }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>삭제하시겠어요?</Text>
                    <Text style={styles.modalDescription}>삭제하면 복구할 수 없어요.</Text>

                    <View style={styles.modalButtonContainer}>
                        {/* 취소 버튼 */}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>취소</Text>
                        </TouchableOpacity>

                        {/* 삭제 버튼 */}
                        <TouchableOpacity
                            style={[styles.modalButton, styles.deleteButton]}
                            onPress={onDelete}
                        >
                            <Text style={styles.deleteButtonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteModal;

// 🔹 스타일 정의
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F4F4F4',
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#FF5C5C',
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
    },
    deleteButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});
