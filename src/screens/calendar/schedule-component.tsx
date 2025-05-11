import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScheduleBoxProps = {
    title: string;
    detail: string;
    navigation: NativeStackNavigationProp<any>;
};

const ScheduleBox: React.FC<ScheduleBoxProps> = ({ title, detail, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
                navigation.navigate('Add', { editMode: true, infos: { title, detail } })
            }
        >
            <View>
                <Text style={styles.titleText}>{title}</Text>
                <Text style={styles.detailText}>{detail}</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-right" size={36} color="#FF8A8A" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    titleText: {
        fontSize: 18,
    },
    detailText: {
        fontSize: 14,
        color: '#979797',
        marginTop: 5,
    },
});

export default ScheduleBox;
