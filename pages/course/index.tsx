import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Modal, TextInput } from 'react-native';
import { RouteProp, useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourseStackParamList } from '../../src/screens/course/course-navigation';
import CourseLayout from '../../src/screens/course/course-layout';
import { RenameFolderModal, RenameDescriptionModal, DeleteFolderModal } from '../../src/components/modals/course';
import DateCourseTab from './datecourse-tab';
import FavoriteCourseTab from './favorite-course-tab';
import * as SecureStore from 'expo-secure-store';

type Folder = {
    id: string;
    title: string;
    description: string;
    courseCount: number;
    image?: string;
};

type CourseScreenProps = {
    route: RouteProp<CourseStackParamList, 'CourseScreen'>;
};

const tabs = ['데이트 코스', '내 코스', '즐겨찾기'];

const CourseScreen = () => {
    const navigation = useNavigation<StackNavigationProp<CourseStackParamList>>();

    const route = useRoute<RouteProp<CourseStackParamList, 'CourseScreen'>>();
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'내 코스' | '데이트 코스' | '즐겨찾기'>(
        route.params?.initialTab ?? '내 코스'
      );
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalData, setModalData] = useState<{ folderName: string; text: string }>({ folderName: '', text: '' });

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const token = await SecureStore.getItemAsync('accessToken');
            // const token = '(로그인 후 액세스 토큰 입력)';
            if (!token) {
                console.warn('⚠️ 토큰이 없습니다. 로그인 상태를 확인해주세요.');
                return;
            }

            const response = await fetch('http://localhost:8080/api/course-folder', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch folders');
            }
    
            const data = await response.json();
    
            setFolders(data.map((folder: any) => ({
                id: folder.folder_id.toString(),
                title: folder.folder_name,
                description: folder.folder_description,
                courseCount: folder.course_count,
                image: folder.folder_image ? { uri: folder.folder_image } : undefined,
            })));
    
        } catch (error) {
            console.error('Error fetching folders:', error);
        } finally {
            setLoading(false);
        }
    };    

    useFocusEffect(
        useCallback(() => {
            if (route.params?.refresh) {
                fetchFolders();
            }
        }, [route.params])
    );

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

    const openModal = (type: 'rename' | 'description', folder: Folder) => {
        setModalData({ folderName: folder.title, text: type === 'rename' ? folder.title : folder.description });
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
        <CourseLayout
        selectedTab={selectedTab}
        onTabSelect={(tab) => {
            setSelectedTab(tab as '내 코스' | '데이트 코스' | '즐겨찾기');
        }}
        >
            {selectedTab === '내 코스' && (
                <View style={styles.courseActionRow}>
                    <TouchableOpacity
                        style={styles.courseFolderButton}
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate('CourseFolderSelect')}
                    >
                        <Image source={require('../../assets/add-square.png')} style={styles.courseButtonIcon} />
                        <Text style={styles.courseFolderButtonText}>코스 만들기</Text>
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
            )}
    
            {selectedTab === '내 코스' && (
                folders.length === 0 ? (
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
                                    <TouchableOpacity
                                        onPress={() => toggleSelectFolder(item.id)}
                                        style={styles.checkboxWrapper}
                                    >
                                        <View style={styles.checkbox}>
                                        {selectedFolders.includes(item.id) && <View style={styles.checkboxSelected} />}
                                        </View>
                                    </TouchableOpacity>
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
                )
            )}

            {selectedTab === '데이트 코스' && (
                <DateCourseTab />
            )}

            {selectedTab === '즐겨찾기' && (
                <FavoriteCourseTab refresh={route.params?.refresh} />
            )}

            {selectedTab === '내 코스' && isDeleteMode && selectedFolders.length > 0 && (
                <TouchableOpacity style={styles.confirmButton} onPress={() => setActiveModal('delete')}>
                    <Text style={styles.confirmButtonText}>삭제하기</Text>
                </TouchableOpacity>
            )}

            {selectedTab === '내 코스' && isEditMode && selectedFolders.length === 1 && (
                <View style={styles.editActionsContainer}>
                    <TouchableOpacity style={styles.editActionButton} onPress={() => openModal('rename', folders.find(f => f.id === selectedFolders[0])!)}>
                        <Text style={styles.editActionText}>폴더명 수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editActionButton} onPress={() => openModal('description', folders.find(f => f.id === selectedFolders[0])!)}>
                        <Text style={styles.editActionText}>설명 수정</Text>
                    </TouchableOpacity>
                </View>
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    createCourseButtonContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    createCourseButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    createCourseButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    checkboxWrapper: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FF6F61',
    },
      
    confirmButton: {
        backgroundColor: '#FF6F61',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 16,
        marginBottom: 16,
    },
      
    confirmButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
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
        marginBottom: 12,
    },
    editActionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CourseScreen;