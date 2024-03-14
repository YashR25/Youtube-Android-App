import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import RoundedImage from '../RoundedImage';
import {tweetInterface} from '../../interfaces/user';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import CustomIcon from '../CustomIcon';
import {colors} from '../../utils/theme';
import {deleteTweet, toggleTweetLike} from '../../store/slices/channelSlice';
import {Menu, Provider} from 'react-native-paper';

type TweetItemProps = PropsWithChildren<{
  tweet: tweetInterface | null;
  isProfile: boolean;
}>;

export default function TweetItem({tweet, isProfile}: TweetItemProps) {
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);

  const onOpen = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handelTweetLikeHandler = () => {
    if (tweet) {
      dispatch(toggleTweetLike(tweet?._id));
    }
  };

  const onDeleteTweetHandler = () => {
    Alert.alert('Delete Tweet', 'Are you sure you want to delete tweet?', [
      {
        text: 'delete',
        onPress: () => {
          if (tweet) dispatch(deleteTweet(tweet?._id));
        },
      },
      {
        text: 'cancel',
        onPress: () => {},
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.channelInfo}>
          <View style={{flexDirection: 'row', gap: 20, alignItems: 'center'}}>
            <RoundedImage url={user?.avatar} size={50} />
            <View>
              <Text style={[styles.text, styles.title]}>{user.fullName}</Text>
            </View>
          </View>
          {user?._id === tweet?.owner._id && (
            <Menu
              anchor={
                <Pressable onPress={onOpen} style={{padding: 8}}>
                  <CustomIcon name="ellipsis-v" size={20} color={colors.text} />
                </Pressable>
              }
              onDismiss={onClose}
              visible={visible}>
              <Menu.Item title="delete" onPress={onDeleteTweetHandler} />
            </Menu>
          )}
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
    justifyContent: 'space-between',
  },
  text: {
    color: colors.text,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
