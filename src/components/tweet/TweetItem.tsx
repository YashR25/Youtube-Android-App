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
    <Provider>
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
            <Menu
              anchor={
                <Pressable onPress={onOpen}>
                  <CustomIcon
                    name="thumbs-o-down"
                    size={20}
                    color={colors.text}
                  />
                </Pressable>
              }
              onDismiss={onClose}
              visible={visible}>
              <Menu.Item title="delete" onPress={onDeleteTweetHandler} />
            </Menu>
          </View>
        )}
      </View>
    </Provider>
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
