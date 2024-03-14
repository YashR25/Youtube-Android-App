import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import SubscribeButton from './SubscribeButton';
import {userInterface} from '../../interfaces/user';
import {colors} from '../../utils/theme';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {toggleSubscription} from '../../store/slices/videoPlaybackSlice';

type ChannelItemProps = PropsWithChildren<{
  channel: userInterface | undefined;
  isSubscribed: boolean;
  visible: boolean;
  onPress: () => void;
}>;

export default function ChannelItem({
  channel,
  isSubscribed,
  visible,
  onPress,
}: ChannelItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const subscriptionHandler = () => {
    if (channel) {
      dispatch(toggleSubscription(channel._id));
    }
  };
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.channelInfo}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: channel?.avatar,
            }}
            style={styles.image}
          />
        </View>
        <Text style={styles.channelTitle}>{channel?.username}</Text>
      </View>
      {visible && (
        <SubscribeButton
          title={isSubscribed ? 'Subscribed' : 'Subscribe'}
          onPress={subscriptionHandler}
          isSubscribed={isSubscribed}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.text,
  },
});
