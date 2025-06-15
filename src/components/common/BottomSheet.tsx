import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';

const BottomSheet = ({ visible, onClose, children }) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
    <View style={styles.sheet}>
      {children}
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'transparent' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 20, minHeight: 120,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -2 }, elevation: 10,
  },
});

export default BottomSheet; 