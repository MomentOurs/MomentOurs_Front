import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  TextInput,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const REPORT_REASONS = ['폭력성', '잘못된 정보', '정치적 발언', '광고성 내용', '음란', '기타'];

const ReportModal: React.FC<ReportModalProps> = ({ visible, onClose, onConfirm }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = () => {
    const finalReason = selected === '기타' ? customReason.trim() : selected;

    if (!finalReason) {
      if (selected === '기타') {
        Alert.alert('입력 필요', '신고 사유를 입력해주세요.');
      }
      return;
    }

    // toast
    if (Platform.OS === 'android') {
      ToastAndroid.show('신고가 완료되었습니다.', ToastAndroid.SHORT);
    } else {
      Alert.alert('신고 완료', '신고가 접수되었습니다.');
    }

    onConfirm(finalReason);
    setSelected(null);
    setCustomReason('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>신고하기</Text>
          <Text style={styles.subtext}>이 게시물을 신고하는 이유</Text>
          <Text style={styles.infoText}>회원님의 신고는 익명으로 처리됩니다.</Text>

          <View style={styles.reasonGrid}>
            {REPORT_REASONS.map((reason) => {
              const isSelected = selected === reason;
              return (
                <TouchableOpacity
                  key={reason}
                  style={styles.reasonItem}
                  onPress={() => setSelected(reason)}
                >
                  <View style={[styles.circle, isSelected && styles.circleSelected]}>
                    {isSelected && <View style={styles.innerCircle} />}
                  </View>
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selected === '기타' && (
            <TextInput
              style={styles.input}
              placeholder="신고 사유를 입력해주세요"
              placeholderTextColor="#aaa"
              value={customReason}
              onChangeText={setCustomReason}
              multiline
            />
          )}

          <TouchableOpacity
            style={[styles.submitButton, !(selected && (selected !== '기타' || customReason.trim())) && { opacity: 0.5 }]}
            onPress={handleSubmit}
            disabled={!(selected && (selected !== '기타' || customReason.trim()))}
          >
            <Text style={styles.submitText}>신고하기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  subtext: { fontSize: 14, color: '#444' },
  infoText: { fontSize: 12, color: '#888', marginBottom: 16 },

  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reasonItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleSelected: {
    borderColor: '#FF6F61',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6F61',
  },
  reasonText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#333',
    minHeight: 40,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReportModal;
