import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SubscriberItem from '../components/SubscriberItem';
import VideoItem from '../components/video/VideoItem';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {
  getSubscriptionVideos,
  getSubscriptions,
} from '../store/slices/subscriptionSlice';
import {userInterface} from '../interfaces/user';
import {videoInterface} from '../interfaces/video';
import VideoList from '../components/video/VideoList';
import {colors} from '../utils/theme';
import SubscriberListSkeleton from '../components/skeleton/SubscriberListSkeleton';
import VideoListSkeleton from '../components/skeleton/VideoListSkeleton';
import YoutubeItemSkeleton from '../components/skeleton/YoutubeItemSkeleton';

export default function Subscription() {
  const [selectedId, setSelectedId] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const user: userInterface | null = useSelector(
    (state: RootState) => state.appConfigReducer.user,
  );
  const subscriptions: [userInterface] | [] = useSelector(
    (state: RootState) => state.subsciptionReducer.subscriptions,
  );
  const subscriptionVideos: [videoInterface] | [] = useSelector(
    (state: RootState) => state.subsciptionReducer.subscriptionVideos,
  );
  useEffect(() => {
    if (user) {
      dispatch(getSubscriptions(user?._id));
    }
  }, []);

  useEffect(() => {
    dispatch(getSubscriptionVideos(selectedId));
  }, [selectedId]);

  if (!subscriptions || !subscriptionVideos) {
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <SubscriberListSkeleton size={5} />
          <FlatList
            data={[1, 2]}
            renderItem={({index}) => <YoutubeItemSkeleton key={index} />}
          />
          {/* <VideoListSkeleton size={2} horizontal={false} /> */}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          data={subscriptions}
          renderItem={({index, item}) => (
            <SubscriberItem
              isSelected={selectedId === item._id}
              onPress={() => setSelectedId(item._id)}
            />
          )}
          horizontal
        />
      </View>
      <VideoList data={subscriptionVideos} horizontal={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 8,
  },
  list: {
    marginVertical: 8,
  },
});
