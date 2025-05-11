import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from './course-navigation';
import { useRoute, CommonActions } from '@react-navigation/native';

const tabs = ['데이트 코스', '내 코스', '즐겨찾기'];

type CourseLayoutProps = {
    selectedTab?: string;
    onTabSelect?: (tab: string) => void;
    children: React.ReactNode;
  };

const CourseLayout = ({ selectedTab, onTabSelect, children }: CourseLayoutProps) => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
    const route = useRoute();
    const [localTab, setLocalTab] = useState('내 코스');
    const activeTab = selectedTab ?? localTab;
    const handleTabSelect = onTabSelect ?? setLocalTab;
    const noBackButtonScreens = ['CourseScreen', 'DateCourseTab', 'FavoriteCourseTab'];

    const handleTabPress = (tab: string) => {
        if (tab === activeTab) return;

        handleTabSelect(tab);

        if (tab === '내 코스') {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'CourseScreen' }]
                })
            );
        } else if (tab === '데이트 코스') {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'DateCourseTab' }]
                })
            );
        } else if (tab === '즐겨찾기') {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'FavoriteCourseTab' }]
                })
            );
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '코스',
          headerLeft: noBackButtonScreens.includes(route.name)
            ? undefined
            : () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
              ),
        });
      }, [navigation, route.name]);

    return (
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tabItem, selectedTab === tab && styles.activeTab]}
                onPress={() => handleTabPress(tab)}
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
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
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
        paddingVertical: 12,
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