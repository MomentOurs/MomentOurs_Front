import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const tabs = ['데이트 코스', '내 코스', '즐겨찾기'];

const CourseLayout = ({ children }: { children: React.ReactNode }) => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('내 코스');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '코스',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.tabItem, selectedTab === tab && styles.activeTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.contentContainer}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAFAFA',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF6F61',
        paddingBottom: 8,
    },
    tabText: {
        fontSize: 16,
        color: '#888',
    },
    activeTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
    },
});

export default CourseLayout;