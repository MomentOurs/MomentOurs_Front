import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

interface Moment {
  momentId: number;
  title: string;
  content: string;
  createdDate: string;
  isMine: boolean;
  likeCount: number;
  commentCount: number;
  isPublic: boolean;
}

const LocationMomentListScreen = () => {
  const route = useRoute<any>();
  const locationId = route.params?.locationId;
  const [myMoments, setMyMoments] = useState<Moment[]>([]);
  const [otherMoments, setOtherMoments] = useState<Moment[]>([]);

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/moment/location/${locationId}`);
      const data = await res.json();
      const moments: Moment[] = data.data || [];
      setMyMoments(moments.filter(m => m.isMine));
      setOtherMoments(moments.filter(m => !m.isMine));
    } catch (e) {
      console.error('[Moment fetch error]', e);
    }
  };

  const renderMoment = (moment: Moment) => (
    <View style={styles.momentBox}>
      <Text style={styles.momentTitle}>{moment.title}</Text>
      <Text style={styles.momentDate}>{moment.createdDate}</Text>
      <Text style={styles.momentContent}>{moment.content}</Text>
      <View style={styles.metaRow}>
        {moment.isPublic && <Text style={styles.metaText}>📂 공개된 글</Text>}
        <Text style={styles.metaText}>👍 좋아요 {moment.likeCount}</Text>
        <Text style={styles.metaText}>💬 댓글 {moment.commentCount}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {myMoments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>우리의 추억</Text>
          {myMoments.map(renderMoment)}
        </View>
      )}
      {otherMoments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>다른 커플의 추억</Text>
          {otherMoments.map(renderMoment)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E85C5C',
    marginBottom: 12,
  },
  momentBox: {
    backgroundColor: '#fdfdfd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  momentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  momentDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: -18,
    marginBottom: 4,
  },
  momentContent: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
});

export default LocationMomentListScreen;
