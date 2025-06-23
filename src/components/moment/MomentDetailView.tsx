import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MomentDetailData {
  momentTitle: string;
  momentContent: string;
  momentCategory: string;
  createdAt: string;
  momentImageUrl?: string;
  memberNickname: string;
  coupleName?: string;
  couplePhoto?: string;
  momentLike: number;
  commentCount: number;
  locationName: string;
}

interface MomentDetailViewProps {
  momentId: number;
  onBack: () => void;
}

const MomentDetailView: React.FC<MomentDetailViewProps> = ({ momentId, onBack }) => {
  const [detail, setDetail] = useState<MomentDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const res = await fetch(`http://localhost:8080/api/moment/${momentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setDetail(data.data);
      } catch (e) {
        console.error('Moment Detail Fetch Error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [momentId]);

  if (loading || !detail) return <ActivityIndicator style={{ flex: 1 }} />;

  const displayName = detail.coupleName || detail.memberNickname;
  const profileImage = detail.couplePhoto || undefined;

  return (
    <ScrollView style={styles.container}>

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.locationName}>{detail.locationName}</Text>
      <Text style={styles.title}>{detail.momentTitle}</Text>

      <View style={styles.authorRow}>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <View>
          <Text style={styles.nickname}>{displayName}</Text>
          <Text style={styles.dateCategory}>
            {detail.createdAt.slice(0, 10)}  #{detail.momentCategory}
          </Text>
        </View>
      </View>

      {detail.momentImageUrl && (
        <Image source={{ uri: detail.momentImageUrl }} style={styles.momentImage} />
      )}

      <Text style={styles.content}>{detail.momentContent}</Text>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Image source={require('../../../assets/thumb-up.png')} style={styles.footerIcon} />
          <Text style={styles.footerText}>{detail.momentLike}</Text>
        </View>
        <View style={styles.footerItem}>
          <Image source={require('../../../assets/message-square.png')} style={styles.footerIcon} />
          <Text style={styles.footerText}>{detail.commentCount}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MomentDetailView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: { 
    marginVertical: 12 
  },
  backButtonText: { 
    color: "#FF6F61", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  locationName: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  nickname: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateCategory: {
    fontSize: 12,
    color: '#999',
  },
  momentImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  footerText: {
    fontSize: 13,
    color: '#555',
  },
});
