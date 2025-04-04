import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as SecureStore from 'expo-secure-store';

type CourseCreateScreenRouteProp = RouteProp<CourseStackParamList, 'CourseCreate'>;
type NavigationProp = StackNavigationProp<CourseStackParamList, 'CourseCreate'>;

const CourseCreateScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CourseCreateScreenRouteProp>();
  const { folderId, folderTitle } = route.params;

  const [courseTitle, setCourseTitle] = useState('');
  const [courseType, setCourseType] = useState<'DATE' | 'TRIP'>('DATE');
  const [isPublic, setIsPublic] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSave = async () => {
    if (!courseTitle.trim()) {
      Alert.alert('코스 제목을 입력해주세요.');
      return;
    }
  
    const payload = {
      courseTitle,
      courseType,
      courseDisclosure: isPublic,
      courseStartDate: courseType === 'DATE'
        ? startDate.toISOString().split('T')[0] + 'T00:00:00'
        : startDate.toISOString().split('T')[0] + 'T00:00:00',
      courseEndDate: courseType === 'DATE'
        ? startDate.toISOString().split('T')[0] + 'T23:59:59'
        : endDate.toISOString().split('T')[0] + 'T23:59:59',
      folderId,
      locations: [],
    };
  
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      // const token = '(로그인 후 액세스 토큰 입력)';
      const response = await fetch('http://localhost:8080/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('코스 생성 실패');
      const data = await response.json();

      Alert.alert('코스가 생성되었습니다!');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'CourseScreen', params: { refresh: true } }],
        })
      );
    } catch (err) {
      Alert.alert('오류', '코스를 생성할 수 없습니다.');
      console.error(err);
    }
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
      <Text style={styles.label}>폴더: {folderTitle}</Text>

      <TextInput
        style={styles.input}
        placeholder="코스 제목을 입력하세요"
        value={courseTitle}
        onChangeText={setCourseTitle}
      />

      <View style={styles.row}>
        <TouchableOpacity onPress={() => setCourseType('DATE')} style={[styles.typeButton, courseType === 'DATE' && styles.active]}>
          <Text style={courseType === 'DATE' ? styles.activeText : styles.inactiveText}>데이트</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCourseType('TRIP')} style={[styles.typeButton, courseType === 'TRIP' && styles.active]}>
          <Text style={courseType === 'TRIP' ? styles.activeText : styles.inactiveText}>여행</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>공개 여부</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>

      <View style={styles.dateGroup}>
        <Text style={styles.label}>시작일</Text>
        <DateTimePicker value={startDate} mode="date" display="default" onChange={(e, date) => date && setStartDate(date)} />
      </View>

      {courseType === 'TRIP' && (
        <View style={styles.dateGroup}>
          <Text style={styles.label}>종료일</Text>
          <DateTimePicker value={endDate} mode="date" display="default" onChange={(e, date) => date && setEndDate(date)} />
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>코스 저장</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {paddingHorizontal: 16,justifyContent: 'center',alignItems: 'center',},
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  typeButton: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginHorizontal: 4 },
  active: { backgroundColor: '#FF6F61' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  inactiveText: { color: '#888' },
  dateGroup: { marginBottom: 16 },
  saveButton: { backgroundColor: '#FF6F61', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CourseCreateScreen;
