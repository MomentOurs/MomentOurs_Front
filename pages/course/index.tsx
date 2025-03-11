import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Modal, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../../src/screens/course/course-navigation';
import CourseLayout from '../../src/screens/course/course-layout';
import { RenameFolderModal, RenameDescriptionModal, DeleteFolderModal } from '../../src/components/modals/course';

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<{ folderName: string; text: string }>({ folderName: '', text: '' });

    useEffect(() => {
        // 실제 API 호출 (주석 처리해둠, 필요 시 활성화)
        // fetchFolders();

        setTimeout(() => {
            setFolders([
                { 
                    id: '1', 
                    title: '경주 관광지/To do', 
                    description: '경주여행 관광 리스트', 
                    courseCount: 3, 
                    image: require('../../assets/image (1).png') 
                },
                { 
                    id: '2', 
                    title: '맛집 리스트', 
                    description: '가고 싶은 맛집, 카페', 
                    courseCount: 5, 
                    image: require('../../assets/image (2).png') 
                },
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

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setIsDeleteMode(false);
        setSelectedFolders([]);
    };

    const toggleDeleteMode = () => {
        setIsDeleteMode(!isDeleteMode);
        setIsEditMode(false);
        setSelectedFolders([]);
    };

    const toggleSelectFolder = (id: string) => {
        setSelectedFolders((prev) =>
            prev.includes(id) ? prev.filter((folderId) => folderId !== id) : [...prev, id]
        );
    };

    const confirmDelete = () => {
        setActiveModal(null);
        setFolders(folders.filter(folder => !selectedFolders.includes(folder.id)));
        setIsDeleteMode(false);
    };

    const openModal = (type: 'rename' | 'description' | 'delete', folder: Folder) => {
        if (type === 'rename') {
            setModalData({ folderName: folder.title, text: folder.title }); // 🛠 폴더명을 초기 값으로 설정
        } else {
            setModalData({ folderName: folder.title, text: folder.description }); // 기존 설명 유지
        }
        setActiveModal(type);
    };    

    if (loading) {
        return (
            <View style={styles.courseCenteredContainer}>
                <ActivityIndicator size="large" color="#FF6F61" />
            </View>
        );
    }

    return (
        <CourseLayout>
            <View style={styles.courseActionRow}>
                <TouchableOpacity
                    style={styles.courseFolderButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('CourseFolderCreate')}
                >
                    <Image source={require('../../assets/add-square.png')} style={styles.courseButtonIcon} />
                    <Text style={styles.courseFolderButtonText}>폴더 만들기</Text>
                </TouchableOpacity>
    
                <View style={styles.courseRightButtons}>
                    <TouchableOpacity
                        style={styles.courseSmallButton}
                        activeOpacity={0.7}
                        onPress={toggleDeleteMode}
                    >
                        <Image source={require('../../assets/trash.png')} style={styles.courseButtonIcon} />
                        <Text style={styles.courseSmallButtonText}>{isDeleteMode ? "취소" : "삭제"}</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity
                        style={styles.courseSmallButton}
                        activeOpacity={0.7}
                        onPress={toggleEditMode}
                    >
                        <Image source={require('../../assets/pencil.png')} style={styles.courseButtonIcon} />
                        <Text style={styles.courseSmallButtonText}>{isEditMode ? "취소" : "편집"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
    
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
                            style={styles.courseFolderItem} 
                            onPress={() => 
                                isDeleteMode || isEditMode 
                                ? toggleSelectFolder(item.id) 
                                : navigation.navigate('CourseFolderDetail', { 
                                    folderId: Number(item.id), 
                                    folderTitle: item.title, 
                                    folderDescription: item.description 
                                })
                            }
                        >
                            {(isDeleteMode || isEditMode) && (
                                <View style={[styles.courseCheckbox, selectedFolders.includes(item.id) && styles.courseCheckboxSelected]} />
                            )}
                            {item.image && (
                                <Image 
                                    source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                                    style={styles.courseFolderImage} 
                                />
                            )}
                            <View>
                                <Text style={styles.courseFolderTitle}>{item.title}</Text>
                                <Text style={styles.courseFolderDescription}>{item.description}</Text>
                                <Text style={styles.courseCourseCount}>{item.courseCount}개</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
    
            <RenameFolderModal 
                visible={activeModal === 'rename'}
                folderName={modalData.folderName}
                renameText={modalData.text}
                onChangeText={(text) => setModalData((prev) => ({ ...prev, text }))} 
                onClose={() => setActiveModal(null)}
                onConfirm={() => console.log('폴더명 변경:', modalData.text)}
            />
    
            <RenameDescriptionModal 
                visible={activeModal === 'description'}
                descriptionText={modalData.text}
                onChangeText={(text) => setModalData((prev) => ({ ...prev, text }))}
                onClose={() => setActiveModal(null)}
                onConfirm={() => console.log('설명 변경:', modalData.text)}
            />
    
            <DeleteFolderModal 
                visible={activeModal === 'delete'}
                folderName={modalData.folderName}
                onClose={() => setActiveModal(null)}
                onConfirm={confirmDelete}
            />
        </CourseLayout>
    );    
};

const styles = StyleSheet.create({
    courseContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAFAFA',
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
        backgroundColor: '#FAFAFA',
        paddingVertical: 8,
        paddingHorizontal: 5,
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
        paddingHorizontal: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginLeft: 8,
        elevation: 3,
    },
    
    courseSmallButtonText: {
        fontSize: 12,
        color: '#888'
    },
    
    courseButtonIcon: {
        width: 14,
        height: 14,
        marginRight: 4,
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
        width: 70,
        height: 70,
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
    },
    courseCheckbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
        marginRight: 10,
    },
    courseCheckboxSelected: {
        backgroundColor: '#FF6F61',
        borderColor: '#FF6F61',
    },

    editActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 5,
        paddingVertical: 5,
    },
    editActionButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        marginHorizontal: 10,
        backgroundColor: '#FF6F61',
        borderRadius: 10,
    },
    editActionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    deleteConfirmButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
    deleteConfirmText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    deleteModalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    deleteModalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: 'row',
    },
    modalCancelButton: {
        padding: 10,
        marginRight: 10,
    },
    modalCancelText: {
        color: '#888',
    },
    modalConfirmButton: {
        padding: 10,
        backgroundColor: '#FF6F61',
        borderRadius: 5,
    },
    modalConfirmText: {
        color: '#FFF',
    },
    editModalContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '85%',
        alignItems: 'center',
    },
    editModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    editModalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
});

export default CourseScreen;