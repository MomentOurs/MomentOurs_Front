import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScheduleBox from './schedule-component';
import CalendarComponent from './calendar-component';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Schedule = {
    planId: number;
    planTitle: string;
    planContent: string;
};

type Props = {
    navigation: NativeStackNavigationProp<any>;
};

type ScheduleListProps = {
    schedules: Schedule[];
    navigation: NativeStackNavigationProp<any>;
};

const dummySchedules: Schedule[] = [
    { planId: 1, planTitle: '서울치과의원 예약', planContent: '2:00PM ~ 3:00PM' },
];

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, navigation }) => {
    return (
        <View style={{ marginTop: 15 }}>
            {schedules.map((schedule) => (
                <ScheduleBox
                    key={schedule.planId}
                    title={schedule.planTitle}
                    detail={schedule.planContent}
                    navigation={navigation}
                />
            ))}
        </View>
    );
};

const EmptyScheduleBox = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#979797' }}>
                새로운 일정을 추가해 보세요!
            </Text>
        </View>
    );
};

const CalendarMainPage: React.FC<Props> = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scheduleType, setScheduleType] = useState<'PERSONAL' | 'COUPLE' | 'ALL'>('ALL');
    const [schedules, setSchedules] = useState<Schedule[]>(dummySchedules);
    const [existSchedule, setExistSchedule] = useState(true);

    const getSchedule = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/plan/schedules/${selectedDate.getFullYear()}/${selectedDate.getMonth() + 1}/${scheduleType}`
            );
            if (!response.ok) throw new Error('Failed to fetch Schedules');
            const data: Schedule[] = await response.json();
            setSchedules(data);
            setExistSchedule(data.length > 0);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    useEffect(() => {
        getSchedule();
    }, [selectedDate, scheduleType]);

    const updateDate = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <View style={styles.container}>
            <CalendarComponent updateDateInParent={updateDate} />
            <View style={styles.divideLine} />
            <View style={{ flex: 1 }}>
                <Text style={styles.dateText}>
                    {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                </Text>
                {existSchedule ? (
                    <ScheduleList schedules={schedules} navigation={navigation} />
                ) : (
                    <EmptyScheduleBox />
                )}
            </View>
            <TouchableOpacity
                style={styles.addBtn}
                onPress={() => navigation.navigate('Add')}
            >
                <Text style={styles.addBtnText}> + 일정 만들기 </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAFAFA',
    },
    addBtn: {
        position: 'absolute',
        bottom: 50,
        right: 15,
        backgroundColor: '#FF8A8A',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    addBtnText: {
        color: '#fff',
        fontSize: 16,
    },
    dateText: {
        fontSize: 18,
    },
    divideLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#E9E9E9',
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
    },
});

export default CalendarMainPage;
