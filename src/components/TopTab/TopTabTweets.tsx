import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useEffect} from 'react';
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

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (user) {
      dispatch(getChannelTweets(user?._id));
    }
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
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
