import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {getChannelTweets} from '../../store/slices/channelSlice';
import TweetItem from '../tweet/TweetItem';
import {colors} from '../../utils/theme';

type TopTabTweetsProps = PropsWithChildren<{
  isProfile: boolean;
}>;

export default function TopTabTweets({isProfile}: TopTabTweetsProps) {
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const tweets = useSelector((state: RootState) => state.channelReducer.tweets);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (user) {
      dispatch(getChannelTweets(user?._id));
    }
  }, []);

  const handleRefresh = () => {
    try {
      setRefreshing(true);
      if (user) {
        dispatch(getChannelTweets(user?._id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={tweets}
        renderItem={({item, index}) => (
          <TweetItem tweet={item} isProfile={isProfile} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.background,
  },
});
