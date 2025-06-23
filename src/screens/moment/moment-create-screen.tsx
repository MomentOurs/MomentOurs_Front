import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MomentCreateForm from '../../components/moment/MomentCreateForm';

export type RootStackParamList = {
  MomentCreate: {
    moment?: {
      momentId: number;
      momentTitle: string;
      momentContent: string;
      momentCategory: string;
      momentCommentStatus: boolean;
    };
    location: {
      locationId: number;
      locationName: string;
    };
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'MomentCreate'>;
type RouteType = RouteProp<RootStackParamList, 'MomentCreate'>;

interface MomentFormData {
  momentTitle: string;
  momentContent: string;
  momentCategory: string;
  momentCommentStatus: boolean;
  momentImageUrls: string;
  locationId: number;
}

const MomentCreateScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const [loading, setLoading] = useState(false);

  const isEditing = !!route.params.moment;
  const initialData = route.params.moment || null;
  const selectedLocation = route.params.location;

  const handleSubmit = async (data: MomentFormData) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');

      const response = await fetch(`http://localhost:8080/api/moment`, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          isEditing
            ? { momentId: initialData!.momentId, ...data }
            : data
        ),
      });

      if (!response.ok) throw new Error('요청에 실패했습니다.');
      await response.json();
      navigation.goBack();
    } catch (error) {
      console.error('[Moment Submit Error]', error);
      Alert.alert('에러', '추억 저장에 실패했어요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MomentCreateForm
        isEditing={isEditing}
        loading={loading}
        initialValues={{
          momentTitle: initialData?.momentTitle,
          momentContent: initialData?.momentContent,
          momentCategory: initialData?.momentCategory,
          momentCommentStatus: initialData?.momentCommentStatus,
        }}
        locationId={selectedLocation.locationId}
        locationName={selectedLocation.locationName}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default MomentCreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
