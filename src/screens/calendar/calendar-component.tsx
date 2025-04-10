import React, { useState, useEffect } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const dummySchedules = [
    '2025-03-13',
    '2025-03-14',
];

interface CalendarProps {
    updateDateInParent: (date: Date ) => void;
}

interface DayCell {
    day: number | string;
    isInCurrentMonth: boolean;
}

const CalendarComponent: React.FC<CalendarProps> = ({ updateDateInParent }) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
    const [selectedDay, setSelectedDay] = useState<Number>(new Date().getDate());
    const [scheduleDates, setScheduleDates] = useState<string[]>(dummySchedules);

    useEffect(() => {
        updateDateInParent(selectedMonth);
    }, [selectedMonth]);

    const goNextMonth = () => {
        setSelectedMonth(
            new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1)
        );
        setSelectedDay(1);
    };
    const goPrevMonth = () => {
        setSelectedMonth(
            new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1)
        );
        setSelectedDay(1);
    };

    const makeDateMatrix = (): DayCell[][] => {
        const matrix: DayCell[][] = [];
        matrix[0] = days.map(day => ({ day, isInCurrentMonth: true }));
        var year = selectedMonth.getFullYear();
        var month = selectedMonth.getMonth();
        var firstDay = new Date(year, month, 1).getDay();
        var maxDay = new Date(year, month + 1, 0).getDate();

        var counter = 1 - firstDay;
        for (var row = 1; row < 7; row++) {
            matrix[row] = [];
            for (var col = 0; col < 7; col++) {
                let cellValue = counter > 0 && counter <= maxDay ? counter : '';
                matrix[row][col] = { day: cellValue, isInCurrentMonth: counter > 0 && counter <= maxDay };
                counter++;
            }
        }
        return matrix;
    }

    const getTextStyle = (rowIdx: number, colIdx: number, item: DayCell): TextStyle => {
        if (rowIdx !== 0) {
            const year = selectedMonth.getFullYear();
            const month = selectedMonth.getMonth() + 1;
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = Number(item.day) < 10 ? `0${item.day}` : item.day;
            const fullDate = `${year}-${formattedMonth}-${formattedDay}`;

            let textStyle: TextStyle = item.isInCurrentMonth
                ? styles.cellTextBlack
                : { ...styles.cellTextGray, ...styles.cellTextGrayOpacity };

            if (item.isInCurrentMonth && scheduleDates.includes(fullDate)) {
                textStyle = styles.scheduledDay;
            }
            if (item.day === selectedDay && item.isInCurrentMonth) {
                textStyle = styles.selectedDay;
            }
            return textStyle;
        } else {
            return styles.cellTextGray; // 요일 표시 줄
        }
    };

    const handleDayPress = (day: number | string, isInCurrentMonth: boolean) => {
        if (typeof day !== 'number') return;
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const formattedMonth = month < 9 ? `0${month + 1}` : (month + 1).toString();
        const formattedDay = day < 10 ? `0${day}` : day.toString();
        const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
        setSelectedDay(day);
        setSelectedMonth(new Date(formattedDate));
    };

    const renderCalendar = () => {
        const matrix = makeDateMatrix();
        const rows = matrix.map((row, rowIdx) => {
            const rowItems = row.map((item, colIdx) => {
                const textStyle = getTextStyle(rowIdx, colIdx, item);
                return (
                    <TouchableOpacity
                        style={styles.cell}
                        key={colIdx}
                        onPress={() => handleDayPress(item.day, item.isInCurrentMonth)}
                    >
                        <Text style={textStyle}>
                            {rowIdx === 0 ? item.day : item.day}
                        </Text>
                    </TouchableOpacity>
                );
            });
            return <View style={{ flexDirection: 'row' }} key={rowIdx}>{rowItems}</View>;
        });
        return <View style={styles.calendar}>{rows}</View>;
    };

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFAFA'
        }}>
            <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <Text style={styles.claendarTitle}>
                        {selectedMonth.getFullYear()}년 {selectedMonth.getMonth() + 1}월
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={goPrevMonth}>
                        <MaterialIcons name="keyboard-arrow-left" size={24} color="#FF8A8A" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goNextMonth}>
                        <MaterialIcons name="keyboard-arrow-right" size={24} color="#FF8A8A" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.calendar}>{renderCalendar()}</View>
        </View>
    );
}

export default CalendarComponent;

const styles = StyleSheet.create({
    calendar: {
        width: '100%',
        height: 280,
        justifyContent: 'space-between',
    },
    cell: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    claendarTitle: {
        fontSize: 18,
        marginBottom: 15,
    },
    cellTextBlack: {
        color: '#000000'
    },
    cellTextGray: {
        color: '#7B7B7B',
    },
    cellTextGrayOpacity: {
        opacity: 0.3,
    },
    selectedDay: {
        color: '#FF8A8A',
        fontWeight: 'bold',
    },
    scheduledDay: {
        backgroundColor: '#FF8A8A',
        color: '#ffffff',
        lineHeight: 40,
        height: 40,
        width: 40,
        borderRadius: 5,
        textAlign: 'center'
    },
})