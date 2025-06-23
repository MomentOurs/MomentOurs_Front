import React, { useState } from 'react';
import { Text, View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '../common/BottomSheet';
import LocationMomentListView from './LocationMomentListView';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../screens/moment/moment-create-screen';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MomentCreate'>;

interface LocationDetail {
  locationId: number;
  locationName: string;
  address: string;
  description?: string;
  images?: string[];
  momentCount: number;
  totalView: number;
  totalLike: number;
}

interface LocationDetailSheetProps {
  visible: boolean;
  onClose: () => void;
  location: LocationDetail | null;
  onViewMoments: () => void;
  onWriteMoment: () => void;
}

const LocationDetailSheet: React.FC<LocationDetailSheetProps> = ({ 
  visible, 
  onClose, 
  location, 
  onViewMoments, 
  onWriteMoment 
}) => {
  const [showMoments, setShowMoments] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  if (!location) return null;
  return (
    <BottomSheet visible={visible} onClose={onClose} fullHeight={showMoments}>
      {showMoments ? (
        <LocationMomentListView
          locationId={location.locationId}
          onBack={() => setShowMoments(false)}
        />
      ) : (
        <View style={{ flexShrink: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{location.locationName}</Text>
            <Text style={styles.metric}>
              {location.totalLike > 0 ? `❤️ ${location.totalLike}` : `📸 ${location.momentCount}`}
            </Text>
          </View>

          {location.description ? (
            <Text style={styles.desc}>{location.description}</Text>
          ) : null}
          <Text style={styles.address}>{location.address}</Text>

          {location.images && location.images.length > 0 && (
            <FlatList
              data={location.images}
              horizontal
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.image} />
              )}
              keyExtractor={(_, idx) => idx.toString()}
              style={{ marginTop: 10 }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => setShowMoments(true)}>
              <Text style={styles.buttonText}>추억 보기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                onClose();
                navigation.navigate('MomentCreate', {
                  location: {
                    locationId: location.locationId,
                    locationName: location.locationName,
                  },
                });
              }}
            >
              <Text style={styles.buttonText}>추억 작성하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  metric: { fontSize: 16, color: '#FF6F61', marginLeft: 8 },
  desc: { color: '#666', marginBottom: 6 },
  address: { marginBottom: 8, color: '#444' },
  image: { width: 100, height: 80, borderRadius: 8, marginRight: 8 },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#FF6F61',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default LocationDetailSheet;
