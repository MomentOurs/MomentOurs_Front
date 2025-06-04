import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
// import AlarmSetModal from './alarm-set-modal';
// import DatePickerModal from './date-picker-modal';
import { StackScreenProps } from '@react-navigation/stack';
import { CalendarStackParamList } from './calendar-container';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RadioButton } from 'react-native-paper';

type AddSchedulePageProps = StackScreenProps<CalendarStackParamList, 'Add'>;

const AddSchedulePage: React.FC<AddSchedulePageProps> = ({ route, navigation }) => {
    type DatePickerMode = 'date' | 'time' | 'datetime';
    const [alarmModalVisible, setAlarmModalVisible] = useState<boolean>(false);
    const [dateModalVisible, setDateModalVisible] = useState<boolean>(false);

    const { editMode = false, planId = 0 } = route.params || {};
    const [title, setTitle] = useState<string>('');
    const [memo, setMemo] = useState<string>('');
    const [place, setPlace] = useState<string>('');
    const [reminderDateTime, setReminderDateTime] = useState<string | null>(null);
    const [category, setCategory] = useState<'couple' | 'personal'>('couple');
    const [allDay, setAllDay] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [datetimeModalMode, setDatetimeModalMode] = useState<DatePickerMode>('date');
    const [datetimeMode, setDatetimeMode] = useState<string>('start');

    const [activeAlarm, setActiveAlarm] = React.useState<boolean>(false);
    const [alarmChecked, setAlarmChecked] = React.useState('dDay');

    const getScheduleInfoAPI = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/plan/${planId}`);
            if (!response.ok) throw new Error('Failed to fetch schedule');
            const data = await response.json();
            setTitle(data.planTitle);
            setMemo(data.planContent);
            setStartDate(data.planStartDate);
            setEndDate(data.planEndDate);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    // 삭제 api
    // const deleteScheduleAPI = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/plan/deactivate/${planId}`, {
    //             method: 'PATCH',
    //         });
    //         if (!response.ok) throw new Error('Failed to delete schedule');
    //     } catch (error) {
    //         console.error('Error deleting schedule:', error);
    //     }
    // };

    const postScheduleAPI = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    planTitle: title,
                    planContent: memo,
                    planStartDate: startDate,
                    planEndDate: endDate,
                    planReminderDatetime: reminderDateTime,
                }),
            });
            if (!response.ok) throw new Error('Failed to create schedule');
        } catch (error) {
            console.error('Error posting schedule:', error);
        }
    };

    const editScheduleAPI = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/plan`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    planTitle: title,
                    planContent: memo,
                    planStartDate: startDate,
                    planEndDate: endDate,
                    planReminderDatetime: reminderDateTime,
                }),
            });
            if (!response.ok) throw new Error('Failed to update schedule');
        } catch (error) {
            console.error('Error editing schedule:', error);
        }
    };

    useEffect(() => {
        if (editMode) {
            getScheduleInfoAPI();
        }
    }, [editMode]);

    const changeCategory = () => {
        setCategory(prev => (prev === 'couple' ? 'personal' : 'couple'));
    };

    const changeAllDay = () => {
        setAllDay(!allDay);
    };

    const uploadSchedule = () => {
        editMode ? editScheduleAPI() : postScheduleAPI();
    };

    const onConfirmDateTime = (selectedDate: Date) => {
        setDateModalVisible(false);
        if (datetimeMode == 'start') setStartDate(selectedDate);
        else setEndDate(selectedDate);
    };

    const onCancelDateTime = () => {
        setDateModalVisible(false);
    };

    const changeActiveAlarm = () => {
        setActiveAlarm(!activeAlarm);
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <TextInput
                    style={styles.inputContainer}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="제목"
                />

                {/* 날짜 & 시간 */}
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'column' }}>
                        <View
                            style={{
                                ...styles.multiContainer,
                                justifyContent: 'space-between',
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Feather
                                    style={texts.marginR}
                                    name="clock"
                                    size={24}
                                    color="#FF8A8A"
                                />
                                <Text style={allDay ? texts.black : texts.grey2}>종일</Text>
                            </View>
                            <TouchableOpacity onPress={changeAllDay}>
                                <MaterialIcons
                                    name={allDay ? 'toggle-on' : 'toggle-off'}
                                    size={24}
                                    color="#FF8A8A"
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={styles.multiContainer}>
                            <MaterialIcons
                                style={texts.marginR}
                                name="keyboard-arrow-right"
                                size={24}
                                color="#FF8A8A"
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setDatetimeModalMode('date');
                                    setDatetimeMode('start');
                                    setDateModalVisible(true);
                                }}>
                                <Text
                                    style={{ fontSize: 18, ...texts.grey3, ...texts.marginR }}>
                                    {startDate.getFullYear()}년 {startDate.getMonth() + 1}월{' '}
                                    {startDate.getDate()}일
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (allDay) return;
                                    setDatetimeModalMode('time');
                                    setDatetimeMode('start');
                                    setDateModalVisible(true);
                                }}>
                                <Text
                                    style={allDay ? texts.unactivateTime : texts.activateTime}>
                                    {startDate.getHours() < 10
                                        ? `0${startDate.getHours()}`
                                        : startDate.getHours()}
                                    :
                                    {startDate.getMinutes() < 10
                                        ? `0${startDate.getMinutes()}`
                                        : startDate.getMinutes()}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.multiContainer}>
                            <MaterialIcons
                                style={texts.marginR}
                                name="keyboard-arrow-left"
                                size={24}
                                color="#FF8A8A"
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setDatetimeModalMode('date');
                                    setDatetimeMode('end');
                                    setDateModalVisible(true);
                                }}>
                                <Text
                                    style={{ fontSize: 18, ...texts.grey3, ...texts.marginR }}>
                                    {endDate.getFullYear()}년 {endDate.getMonth() + 1}월{' '}
                                    {endDate.getDate()}일
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (allDay) return;
                                    setDatetimeModalMode('time');
                                    setDatetimeMode('end');
                                    setDateModalVisible(true);
                                }}>
                                <Text
                                    style={allDay ? texts.unactivateTime : texts.activateTime}>
                                    {endDate.getHours() < 10
                                        ? `0${endDate.getHours()}`
                                        : endDate.getHours()}
                                    :
                                    {endDate.getMinutes() < 10
                                        ? `0${endDate.getMinutes()}`
                                        : endDate.getMinutes()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 메모 */}
                <View style={styles.inputContainer}>
                    <View style={styles.multiContainer}>
                        <MaterialCommunityIcons style={texts.marginR} name="note-text-outline" size={24} color="#FF8A8A" />
                        <TextInput
                            style={{ fontSize: 18 }}
                            value={memo}
                            onChangeText={setMemo}
                            placeholder="메모를 입력해 주세요"
                        />
                    </View>
                </View>

                {/* 알람 */}
                <View style={styles.inputContainer}>
                    <View
                        style={{
                            ...styles.multiContainer,
                            justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons
                                style={texts.marginR}
                                name="alarm-outline"
                                size={24}
                                color="#FF8A8A"
                            />
                            <Text style={{ fontSize: 18 }}>
                                {activeAlarm ? `알람` : `알람 없음`}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={changeActiveAlarm}>
                            <MaterialIcons
                                name={activeAlarm ? 'toggle-on' : 'toggle-off'}
                                size={24}
                                color="#FF8A8A"
                            />
                        </TouchableOpacity>
                    </View>
                    {activeAlarm ? (
                        <View>
                            <View style={styles.radioContainer}>
                                <Text>당일</Text>
                                <RadioButton
                                    value="dDay"
                                    status={alarmChecked === 'dDay' ? 'checked' : 'unchecked'}
                                    onPress={() => setAlarmChecked('dDay')}
                                />
                            </View>
                            <View style={styles.radioContainer}>
                                <Text>하루 전</Text>
                                <RadioButton
                                    value="aDayAgo"
                                    status={alarmChecked === 'aDayAgo' ? 'checked' : 'unchecked'}
                                    onPress={() => setAlarmChecked('aDayAgo')}
                                />
                            </View>
                            <View style={styles.radioContainer}>
                                <Text>이틀 전</Text>
                                <RadioButton
                                    value="twoDayAgo"
                                    status={
                                        alarmChecked === 'twoDayAgo' ? 'checked' : 'unchecked'
                                    }
                                    onPress={() => setAlarmChecked('twoDayAgo')}
                                />
                            </View>
                        </View>
                    ) : null}
                </View>

                {/* 위치 */}
                <View style={styles.inputContainer}>
                    <View style={styles.multiContainer}>
                        <Feather style={texts.marginR} name="map-pin" size={24} color="#FF8A8A" />
                        <TextInput
                            style={{ fontSize: 18 }}
                            value={place}
                            onChangeText={setPlace}
                            placeholder="위치 등록"
                        />
                    </View>
                </View>

                {/* 카테고리 */}
                <View style={styles.inputContainer}>
                    <View style={{ ...styles.multiContainer, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Octicons style={texts.marginR} name="person" size={24} color="#FF8A8A" />
                            <Text style={{ fontSize: 18 }}>{category === 'couple' ? '커플' : '개인'}</Text>
                        </View>
                        <TouchableOpacity onPress={changeCategory}>
                            <MaterialIcons
                                name={category === 'couple' ? 'toggle-on' : 'toggle-off'}
                                size={24}
                                color="#FF8A8A"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 하단 버튼 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                    <Text>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={uploadSchedule}>
                    <Text>확인</Text>
                </TouchableOpacity>
            </View>

            {/* 모달  */}
            <DateTimePickerModal
                isVisible={dateModalVisible}
                mode={datetimeModalMode}
                onConfirm={onConfirmDateTime}
                onCancel={onCancelDateTime}
                date={startDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FAFAFA',
    },
    inputContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 18,
    },
    multiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmBtn: {
        backgroundColor: '#FF8A8A',
        color: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 75,
        paddingVertical: 15
    },
    cancelBtn: {
        backgroundColor: '#F4F4F4',
        color: '#000000',
        borderRadius: 10,
        paddingHorizontal: 75,
        paddingVertical: 15
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
      }  
});

const texts = StyleSheet.create({
    grey2: {
        color: '#D9D9D9',
    },
    grey3: {
        color: '#7B7B7B',
    },
    marginR: {
        marginRight: 15
    },
    black: {
        color: '#000000'
    },
    activateTime: {
        fontSize: 18,
        color: '#7B7B7B',
        marginRight: 15
    },
    unactivateTime: {
        fontSize: 18,
        color: '#D9D9D9',
        marginRight: 15
    }
});

export default AddSchedulePage;