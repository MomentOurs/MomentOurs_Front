import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MomentDetailView from "../moment/MomentDetailView";

const iconMap = {
  lockOpen: require("../../../assets/lock-open.png"),
  lockClose: require("../../../assets/lock-close.png"),
  heart: require("../../../assets/heart.png"),
  heartFull: require("../../../assets/heart-full.png"),
  alertTriangle: require("../../../assets/alert-triangle.png"),
  messageSquare: require("../../../assets/message-square.png"),
};

type Moment = {
  momentId: number;
  momentTitle: string;
  momentCategory: string;
  locationName: string;
  momentImageUrl: string;
  momentContent: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  commentEnabled: boolean;
  isOurs: boolean;
  commentCount: number;
  isLiked: boolean;
};

interface LocationMomentListViewProps {
  locationId: number;
  onBack: () => void;
}

const LocationMomentListView: React.FC<LocationMomentListViewProps> = ({
  locationId,
  onBack,
}) => {
  const [ours, setOurs] = useState<Moment[]>([]);
  const [others, setOthers] = useState<Moment[]>([]);
  const [oursCursor, setOursCursor] = useState<number | null>(null);
  const [othersCursor, setOthersCursor] = useState<number | null>(null);
  const [hasNextOurs, setHasNextOurs] = useState<boolean>(false);
  const [hasNextOthers, setHasNextOthers] = useState<boolean>(false);
  const [tab, setTab] = useState<"ours" | "others">("others");
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedMomentId, setSelectedMomentId] = useState<number | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchInitialMoments();
  }, []);

  const fetchInitialMoments = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8080/api/location/${locationId}/moments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const oursFetched = data?.data?.ours?.moments ?? [];
      const othersFetched = data?.data?.others?.moments ?? [];

      setOurs(oursFetched);
      setOursCursor(data?.data?.ours?.nextCursor ?? null);
      setHasNextOurs(data?.data?.ours?.hasNext ?? false);

      setOthers(othersFetched);
      setOthersCursor(data?.data?.others?.nextCursor ?? null);
      setHasNextOthers(data?.data?.others?.hasNext ?? false);

      setTab(oursFetched.length > 0 ? "ours" : "others");
    } catch (e) {
      console.error("[Initial Moment fetch error]", e);
    }
  };

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    const isOursTab = tab === "ours";
    const cursor = isOursTab ? oursCursor : othersCursor;
    const hasNext = isOursTab ? hasNextOurs : hasNextOthers;
    if (!hasNext || cursor === null) return;

    setLoadingMore(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8080/api/location/${locationId}/moments?cursor=${cursor}&type=${isOursTab ? "ours" : "others"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const fetched = data?.data?.[tab]?.moments ?? [];
      const nextCursor = data?.data?.[tab]?.nextCursor ?? null;
      const nextHasNext = data?.data?.[tab]?.hasNext ?? false;

      if (isOursTab) {
        setOurs((prev) => [...prev, ...fetched]);
        setOursCursor(nextCursor);
        setHasNextOurs(nextHasNext);
      } else {
        setOthers((prev) => [...prev, ...fetched]);
        setOthersCursor(nextCursor);
        setHasNextOthers(nextHasNext);
      }
    } catch (e) {
      console.error("[Load More Error]", e);
    } finally {
      setLoadingMore(false);
    }
  }, [tab, oursCursor, othersCursor, hasNextOurs, hasNextOthers, loadingMore]);

  const handleLikeToggle = async (target: Moment) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      const baseUrl = `http://localhost:8080/api/like`;

      const url = target.isLiked
        ? `${baseUrl}?type=MOMENT&targetId=${target.momentId}`
        : baseUrl;

      const options: RequestInit = {
        method: target.isLiked ? "DELETE" : "POST",
        headers: {
          ...(target.isLiked
            ? { Authorization: `Bearer ${token}` }
            : {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }),
        },
        ...(target.isLiked
          ? {}
          : {
              body: JSON.stringify({
                type: "MOMENT",
                targetId: target.momentId,
              }),
            }),
      };

      await fetch(url, options);

      const updateList = (list: Moment[]) =>
        list.map((item) =>
          item.momentId === target.momentId
            ? {
                ...item,
                isLiked: !target.isLiked,
                likeCount: target.likeCount + (target.isLiked ? -1 : 1),
              }
            : item
        );

      if (tab === "ours") {
        setOurs(updateList);
      } else {
        setOthers(updateList);
      }
    } catch (e) {
      console.error("[Like Toggle Error]", e);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 10);
  };

  const renderMoment = ({ item: moment }: { item: Moment }) => (
    <TouchableOpacity
      key={moment.momentId}
      onPress={() => setSelectedMomentId(moment.momentId)}
    >
      <View style={styles.momentBox}>
        {moment.momentImageUrl && (
          <Image source={{ uri: moment.momentImageUrl }} style={styles.image} />
        )}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={moment.commentEnabled ? iconMap.lockOpen : iconMap.lockClose}
              style={[styles.icon, { marginRight: 6 }]}
            />
            <Text style={styles.momentTitle}>{moment.momentTitle}</Text>
          </View>
          <Text style={styles.createdDate}>{formatDate(moment.createdAt)}</Text>
        </View>
        <Text style={styles.momentMeta}>
          장소: {moment.locationName} | 카테고리: {moment.momentCategory}
        </Text>
        <Text style={styles.momentContent}>{moment.momentContent}</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconGroup}>
            <TouchableOpacity onPress={() => handleLikeToggle(moment)}>
              <Image source={moment.isLiked ? iconMap.heartFull : iconMap.heart} style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.iconText}>{moment.likeCount}</Text>
          </View>

          <View style={styles.iconGroup}>
            <Image source={iconMap.messageSquare} style={styles.icon} />
            <Text style={styles.iconText}>{moment.commentCount}</Text>
          </View>

          <View style={styles.iconGroup}>
            <Image source={iconMap.alertTriangle} style={styles.icon} />
          </View>
        </View>

        {moment.isOurs && <Text style={styles.mineBadge}>내가 작성함</Text>}
      </View>
    </TouchableOpacity>
  );

  const currentList = tab === "ours" ? ours : others;
  const showLoadMore = tab === "ours" ? hasNextOurs : hasNextOthers;

  return (
    <View style={styles.container}>
      {selectedMomentId ? (
      <MomentDetailView
        momentId={selectedMomentId}
        onBack={() => setSelectedMomentId(null)}
      />
    ) : (
      <>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {(ours.length > 0 || others.length > 0) && (
          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setTab("ours")}
              style={[styles.tabButton, tab === "ours" && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === "ours" && styles.activeTabText]}>우리의 추억</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab("others")}
              style={[styles.tabButton, tab === "others" && styles.activeTab]}
            >
              <Text style={[styles.tabText, tab === "others" && styles.activeTabText]}>다른 커플의 추억</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          {tab === "ours" ? "우리의 추억" : "다른 커플의 추억"}
        </Text>

        <View style={{ flex: 1 }}>
          <FlatList
            data={currentList}
            keyExtractor={(item) => item.momentId.toString()}
            renderItem={renderMoment}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            onEndReached={loadMore}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <Text style={styles.emptyText}>등록된 추억이 없습니다.</Text>
            }
            ListFooterComponent={
              showLoadMore && loadingMore ? (
                <ActivityIndicator style={{ marginVertical: 12 }} />
              ) : null
            }
          />
        </View>
      </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 16, 
    backgroundColor: "#fff" 
  },
  backButton: { 
    marginVertical: 12 
  },
  backButtonText: { 
    color: "#FF6F61", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#E85C5C", 
    marginBottom: 12, 
    marginTop: 12 
  },
  tabRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginBottom: 12 
  },
  tabButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 6, 
    borderBottomWidth: 2, 
    borderColor: "transparent" 
  },
  activeTab: { 
    borderColor: "#E85C5C" 
  },
  tabText: { 
    fontSize: 15, 
    color: "#888" 
  },
  activeTabText: { 
    color: "#E85C5C", 
    fontWeight: "bold" 
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  momentBox: { 
    marginBottom: 16, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: "#eee", 
    borderRadius: 10, 
    backgroundColor: "#fdfdfd" 
  },
  headerRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  momentTitle: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#333" 
  },
  createdDate: { 
    fontSize: 12, 
    color: "#aaa" 
  },
  momentMeta: { 
    fontSize: 13, 
    color: "#666", 
    marginTop: 4 
  },
  momentContent: { 
    fontSize: 12, 
    color: "#444", 
    marginTop: 4 
  },
  iconRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 6 
  },
  iconGroup: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    flex: 1 
  },
  icon: { 
    width: 16, 
    height: 16, 
    marginRight: 4 
  },
  iconText: { 
    marginRight: 8, 
    fontSize: 12, 
    color: "#666" 
  },
  mineBadge: { 
    marginTop: 4, 
    color: "#FF6F61", 
    fontSize: 12, 
    fontWeight: "bold" 
  },
  image: { 
    width: "80%", 
    height: 120, 
    borderRadius: 8 
  },
  emptyText: { 
    color: "#999", 
    fontSize: 14, 
    marginTop: 8, 
    textAlign: "center" 
  },
});

export default LocationMomentListView;