import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import SubscriberItem from '../components/SubscriberItem';
import VideoItem from '../components/video/VideoItem';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {
  getAllSubscriptionVideos,
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
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootParamList} from '../App';
import FooterLoadingComponent from '../components/FooterLoadingComponent';

type SubscriptionScreenProps = BottomTabScreenProps<
  RootParamList,
  'Subscription'
>;

export default function Subscription({navigation}: SubscriptionScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const user: userInterface | null = useSelector(
    (state: RootState) => state.appConfigReducer.user,
  );
  const subscriptions: [userInterface] | null = useSelector(
    (state: RootState) => state.subsciptionReducer.subscriptions,
  );
  const subscriptionVideos: videoInterface[] | null = useSelector(
    (state: RootState) => state.subsciptionReducer.subscriptionVideos,
  );
  const hasNextPage = useSelector(
    (state: RootState) => state.subsciptionReducer.hasNextPage,
  );

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(false);

  const getVideoData = () => {
    setLoading(true);
    if (selectedId) {
      dispatch(
        getSubscriptionVideos({userId: selectedId, page: page, limit: limit}),
      );
    }
    // else {
    //   dispatch(getAllSubscriptionVideos());
    // }

    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      dispatch(getSubscriptions(user?._id));
      dispatch(getAllSubscriptionVideos());
    }
  }, [navigation]);

  // useEffect(() => {
  //   if (subscriptions && subscriptions[0]?._id) {
  //     setSelectedId(subscriptions[0]?._id);
  //   }
  // }, [subscriptions]);

  useEffect(() => {
    if (selectedId) {
      dispatch(getSubscriptionVideos({userId: selectedId, page: 1, limit: 2}));
    } else {
      dispatch(getAllSubscriptionVideos());
    }
  }, [selectedId]);

  const handleRefresh = () => {
    if (user) dispatch(getSubscriptions(user?._id));
    if (selectedId) {
      dispatch(getSubscriptionVideos({userId: selectedId, page: 1, limit: 2}));
    } else {
      dispatch(getAllSubscriptionVideos());
    }
  };

  // console.log('subscriptionVideos', subscriptionVideos);

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

  console.log(subscriptionVideos);

  if (subscriptions.length <= 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}>
        <Text
          style={{color: colors.gray, fontWeight: 'bold'}}
          ellipsizeMode="tail">
          Not subscribed to any channel yet
        </Text>
      </View>
    );
  }

  console.log('subscriptions', subscriptions);

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        <FlatList
          data={subscriptions}
          renderItem={({index, item}) => (
            <SubscriberItem
              isSelected={selectedId === item._id}
              onPress={() => {
                console.log('called select');
                setSelectedId(item._id);
              }}
              url={item.avatar}
              title={item.username}
            />
          )}
          horizontal
        />
      </View>
      {subscriptionVideos.length > 0 ? (
        <VideoList
          footerComponent={() => (loading ? <FooterLoadingComponent /> : <></>)}
          onEndReach={() => {
            if (hasNextPage) {
              getVideoData();
            }
          }}
          listEmptyComponent={() => <></>}
          headerComponent={() => <></>}
          data={subscriptionVideos}
          horizontal={false}
          handleRefresh={handleRefresh}
          refreshing={refreshing}
          shouldShowSubscriberButton={false}
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', color: colors.gray}}>
            No any videos from this channel yet
          </Text>
        </View>
      )}
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
