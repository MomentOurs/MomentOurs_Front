import React from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import MomentDetailView from '../../components/moment/MomentDetailView';

const MomentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { momentId } = route.params as { momentId: number };

  return (
    <MomentDetailView
      momentId={momentId}
      onBack={() => navigation.goBack()}
    />
  );
};

export default MomentDetailScreen;