import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import RoundedImage from '../RoundedImage';
import {tweetInterface} from '../../interfaces/user';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import CustomIcon from '../CustomIcon';
import {colors} from '../../utils/theme';
import {toggleTweetLike} from '../../store/slices/channelSlice';

type TweetItemProps = PropsWithChildren<{
  tweet: tweetInterface | null;
  isProfile: boolean;
}>;

export default function TweetItem({tweet, isProfile}: TweetItemProps) {
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const dispatch = useDispatch<AppDispatch>();

  const handelTweetLikeHandler = () => {
    if (tweet) {
      dispatch(toggleTweetLike(tweet?._id));
    }
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.channelInfo}>
          <RoundedImage url={user?.avatar} size={50} />
          <View>
            <Text style={[styles.text, styles.title]}>{user.fullName}</Text>
          </View>
        </View>
      )}
      <Text style={styles.text}>{tweet?.content}</Text>
      {!isProfile && (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <Pressable onPress={handelTweetLikeHandler}>
            <CustomIcon
              name={tweet?.isLiked ? 'thumbs-up' : 'thumbs-o-up'}
              size={20}
              color={colors.text}
            />
          </Pressable>
          <Pressable>
            <CustomIcon name="thumbs-o-down" size={20} color={colors.text} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    padding: 8,
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    color: colors.text,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
