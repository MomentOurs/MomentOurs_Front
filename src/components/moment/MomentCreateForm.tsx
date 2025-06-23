import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CATEGORY_OPTIONS = ['산책', '카페', '맛집', '여행', '체험'];

interface MomentCreateFormProps {
  initialValues?: {
    momentTitle?: string;
    momentContent?: string;
    momentCategory?: string;
    momentCommentStatus?: boolean;
  };
  onSubmit: (data: {
    momentTitle: string;
    momentContent: string;
    momentCategory: string;
    momentCommentStatus: boolean;
    momentImageUrls: string;
    locationId: number;
  }) => void;
  locationId: number;
  locationName?: string;
  isEditing?: boolean;
  loading?: boolean;
}

const MomentCreateForm: React.FC<MomentCreateFormProps> = ({
  initialValues,
  onSubmit,
  locationId,
  locationName,
  isEditing = false,
  loading = false,
}) => {
  const [title, setTitle] = useState(initialValues?.momentTitle || '');
  const [content, setContent] = useState(initialValues?.momentContent || '');
  const [category, setCategory] = useState(initialValues?.momentCategory || '');
  const [commentEnabled, setCommentEnabled] = useState(
    initialValues?.momentCommentStatus ?? true
  );
  const [imageUri, setImageUri] = useState<string>('');

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
    }
};

  const handleSubmit = () => {
    if (!title || !category || !content) return;
    onSubmit({
      momentTitle: title,
      momentContent: content,
      momentCategory: category,
      momentCommentStatus: commentEnabled,
      momentImageUrls: imageUri,
      locationId: locationId,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="제목"
          placeholderTextColor="#ccc"
          value={title}
          onChangeText={setTitle}
          style={styles.titleInput}
        />

        {locationName && (
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationName}>{locationName}</Text>
          </View>
        )}

        <View style={styles.categoryRow}>
          {CATEGORY_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.selectedCategory,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="연인과 함께한 소중한 순간을 남겨보세요!"
          value={content}
          onChangeText={setContent}
          style={styles.textarea}
          multiline
          numberOfLines={6}
          placeholderTextColor="#ccc"
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>댓글 허용</Text>
          <Switch value={commentEnabled} onValueChange={setCommentEnabled} />
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : null}
      </ScrollView>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.attachButton} onPress={handleImagePick}>
          <Text style={styles.attachText}>파일 첨부</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveText}>{isEditing ? '수정' : '저장'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MomentCreateForm;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 100,
    paddingTop: 50,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationName: {
    fontSize: 14,
    color: '#999',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  categoryText: {
    color: '#666',
    fontSize: 13,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    minHeight: 120,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
  },
  attachButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  attachText: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: '#FF6F61',
  },
  saveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
