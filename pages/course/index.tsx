import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../../src/screens/course/course-navigation';

type Folder = {
    id: string;
    title: string;
    description: string;
    courseCount: number;
    image?: string;
};

const tabs = ['데이트 코스', '내 코스', '즐겨찾기'];

const CourseScreen = ({ route }) => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();
    
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('내 코스');
    const [isPressed, setIsPressed] = useState(false);
    const [isPressedFolder, setIsPressedFolder] = useState(false);
    const [isPressedDelete, setIsPressedDelete] = useState(false);
    const [isPressedEdit, setIsPressedEdit] = useState(false);
    const [pressedTab, setPressedTab] = useState<string | null>(null);
    const [pressedFolder, setPressedFolder] = useState<string | null>(null);


    useEffect(() => {
        // 실제 API 호출 (주석 처리해둠, 필요 시 활성화)
        // fetchFolders();

        setTimeout(() => {
            setFolders([
                { id: '1', title: '경주 관광지/To do', description: '경주여행 관광 리스트', courseCount: 3, image: 'https://example.com/image1.jpg' },
                { id: '2', title: '맛집 리스트', description: '가고 싶은 맛집, 카페', courseCount: 5, image: 'https://example.com/image2.jpg' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // const fetchFolders = async () => {
    //     try {
    //         const response = await fetch('http://localhost:8080/api/course-folder', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer YOUR_ACCESS_TOKEN`, // 실제 토큰 필요
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch folders');
    //         }

    //         const data = await response.json();
            
    //         setFolders(data.map((folder: any) => ({
    //             id: folder.folderId,
    //             title: folder.folderName,
    //             description: folder.folderDescription,
    //             courseCount: folder.courseCount,
    //             image: folder.folderImage || undefined,
    //         })));

    //     } catch (error) {
    //         console.error('Error fetching folders:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchFolders();
    // }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         if (route.params?.refresh) {
    //             fetchFolders();
    //         }
    //     }, [route.params])
    // );

    if (loading) {
        return (
            <View style={styles.courseCenteredContainer}>
                <ActivityIndicator size="large" color="#FF6F61" />
            </View>
        );
    }

    return (
        <View style={styles.courseContainer}>
            <View style={styles.courseTabContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity 
                        key={tab} 
                        style={[styles.courseTabItem, selectedTab === tab && styles.courseActiveTab, pressedTab === tab && styles.buttonPressed]}
                        onPress={() => setSelectedTab(tab)}
                        onPressIn={() => setPressedTab(tab)}
                        onPressOut={() => setPressedTab(null)}
                    >
                        <Text style={[styles.courseTabText, selectedTab === tab && styles.courseActiveTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.courseActionRow}>
                <TouchableOpacity
                    style={[styles.courseFolderButton, isPressedFolder && styles.buttonPressed]}
                    activeOpacity={0.7}
                    onPressIn={() => setIsPressedFolder(true)}
                    onPressOut={() => setIsPressedFolder(false)}
                    onPress={() => navigation.navigate('CourseFolderCreate')}
                >
                    <Image source={require('../../assets/add-square.png')} style={styles.courseButtonIcon} />
                    <Text style={styles.courseFolderButtonText}>폴더 만들기</Text>
                </TouchableOpacity>

                <View style={styles.courseRightButtons}>
                    <TouchableOpacity
                        style={[styles.courseSmallButton, isPressedDelete && styles.buttonPressed]}
                        activeOpacity={0.7}
                        onPressIn={() => setIsPressedDelete(true)}
                        onPressOut={() => setIsPressedDelete(false)}
                    >
                        <Image source={require('../../assets/trash.png')} style={styles.courseButtonIcon} />
                        <Text style={styles.courseSmallButtonText}>삭제</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.courseSmallButton, isPressedEdit && styles.buttonPressed]}
                        activeOpacity={0.7}
                        onPressIn={() => setIsPressedEdit(true)}
                        onPressOut={() => setIsPressedEdit(false)}
                    >
                        <Image source={require('../../assets/pencil.png')} style={styles.courseButtonIcon} />
                        <Text style={styles.courseSmallButtonText}>편집</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {selectedTab === '내 코스' && (
                <>
                    {folders.length === 0 ? (
                        <View style={styles.courseEmptyMessageContainer}>
                            <Text style={styles.courseEmptyMessage}>새로운 폴더를 생성해 보세요!</Text>
                        </View>
                    ) : ( 
                    <FlatList 
                        data={folders}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={[styles.courseFolderItem, pressedFolder === item.id && styles.buttonPressed]} 
                                onPress={() => navigation.navigate('CourseDetail', { folderId: item.id })}
                                onPressIn={() => setPressedFolder(item.id)}
                                onPressOut={() => setPressedFolder(null)}
                            >
                                {item.image && <Image source={{ uri: item.image }} style={styles.courseFolderImage} />}
                                <View>
                                    <Text style={styles.courseFolderTitle}>{item.title}</Text>
                                    <Text style={styles.courseFolderDescription}>{item.description}</Text>
                                    <Text style={styles.courseCourseCount}>{item.courseCount}개</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    )}
                </>
            )}

            <View style={styles.courseBottomContainer}>
                <TouchableOpacity
                    style={[styles.createCourseButton, isPressed && styles.createCourseButtonPressed]}
                    activeOpacity={0.7}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                >
                    <Text style={styles.createCourseButtonText}>+ 코스 만들기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    courseContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    courseCenteredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 6,
        paddingHorizontal: 10,
    },
    courseRightButtons: {
        flexDirection: 'row',
    },
    courseFolderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    
    courseFolderButtonText: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'medium',
        marginLeft: 6,
    },
    courseSmallButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginLeft: 8,
        elevation: 3,
    },
    
    courseSmallButtonText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 6,
    },
    
    courseButtonIcon: {
        width: 12,
        height: 12,
        tintColor: '#888',
    },
    courseTabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
    },
    courseTabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    courseActiveTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#FF6F61',
    },
    courseTabText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    courseActiveTabText: {
        color: '#000',
        fontWeight: 'bold',
    },
    courseEmptyMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseEmptyMessage: {
        fontSize: 16,
        color: '#aaa',
    },
    courseFolderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 14,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4,
        elevation: 3,
    },
    courseFolderImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    courseFolderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    courseFolderDescription: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    courseCourseCount: {
        fontSize: 12,
        color: '#999',
    },
    courseBottomContainer: {
        marginTop: 'auto',
        alignItems: 'flex-end',
        paddingVertical: 10,
    },
    
    createCourseButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 15,
    },
    
    createCourseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    createCourseButtonPressed: {
        backgroundColor: '#E85C50',
    },

    buttonPressed: {
        backgroundColor: '#F0F0F0',
    }    
});

export default CourseScreen;