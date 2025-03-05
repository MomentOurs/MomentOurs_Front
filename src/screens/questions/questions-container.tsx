import React from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 🔹 네비게이션 타입 정의
type RootStackParamList = {
    Questions: undefined;
};
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Questions'>;
};

const QuestionsScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* 🔹 스크롤 가능한 질문 UI */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.date}>Day</Text>
                <Text style={styles.dateNumber}>2025.01.04</Text>

                {/* 하트 이미지로 변경 */}
                <View style={styles.heartContainer}>
                    <Image source={require('../../../assets/images/questions/heart.png')} style={styles.heart} />
                </View>

                <Text style={styles.questionNumber}>#120번째 질문</Text>
                <Text style={styles.questionText}>
                    사랑하는 연인과 가장 행복했던 시간은 언제인가요?
                </Text>

                {/* 🔹 답변 입력 필드 */}
                <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>지연님의 답변</Text>
                    <TextInput
                        style={styles.answerInput}
                        placeholder="이곳을 눌러서 답변을 입력해 주세요."
                        placeholderTextColor="#7B7B7B"
                        multiline={true}  // 여러 줄 입력 가능
                        numberOfLines={4} // 초기 줄 수 설정
                        textAlignVertical="top" // 상단 정렬 (iOS & Android)
                    />
                </View>

                <View style={styles.answerContainer}>
                    <Text style={styles.answerLabel}>승철님의 답변</Text>
                    <TextInput
                        style={styles.disabledAnswerInput}
                        value="승철님이 아직 답변하지 않았어요."
                        editable={false} // 입력 비활성화
                        textAlignVertical="top"
                        multiline={true}
                    />
                </View>
            </ScrollView>

            {/* 🔹 우측 하단 채팅 버튼 */}
            <TouchableOpacity style={styles.chatButton} onPress={() => console.log('댓글 버튼 클릭')}>
                <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default QuestionsScreen;

// 🔹 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    date: {
        fontSize: 14,
        fontWeight: '600',
        color: '#454545',
    },
    dateNumber: {
        fontSize: 14,
        marginVertical: 5,
        color: '#454545'
    },
    heartContainer: {
        marginVertical: 10,
    },
    heart: {
        width: 30,  // 이미지 크기 조정
        height: 30,
        resizeMode: 'contain',
    },
    questionNumber: {
        fontSize: 14,
        color: '#454545',
        marginTop: 10,
    },
    questionText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
        marginHorizontal: 60
    },
    answerContainer: {
        width: '100%',
        paddingHorizontal: 2,
        marginTop: 20,
    },
    answerLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    answerInput: {
        width: '100%',
        padding: 15,
        borderWidth: 0, // 🔹 테두리 제거
        borderColor: 'transparent', // 🔹 혹시라도 테두리가 남아있을 경우 투명 처리
        borderRadius: 10, // 모서리 둥글게 유지 (선택 사항)
        backgroundColor: '#F4F4F4',
        minHeight: 45, // 최소 높이 설정
    },
    disabledAnswerInput: {
        width: '100%',
        padding: 15,
        borderWidth: 0, // 🔹 테두리 제거
        borderColor: 'transparent', // 🔹 혹시라도 테두리가 남아있을 경우 투명 처리
        borderRadius: 10, // 모서리 둥글게 유지 (선택 사항)
        backgroundColor: '#F4F4F4', // 연한 배경색
        color: '#7B7B7B', // 텍스트 색상
        minHeight: 45, // 최소 높이 설정
        textAlignVertical: 'center', // 텍스트 중앙 정렬
    },
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#ff6b81',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
});
