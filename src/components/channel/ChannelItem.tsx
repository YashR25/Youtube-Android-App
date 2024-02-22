import {Image, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import SubscribeButton from './SubscribeButton';
import {userInterface} from '../../interfaces/user';
import {colors} from '../../utils/theme';

type ChannelItemProps = PropsWithChildren<{
  channel: userInterface | undefined;
  isSubscribed: boolean;
}>;

export default function ChannelItem({channel, isSubscribed}: ChannelItemProps) {
  return (
    <View style={styles.container}>
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
      <SubscribeButton
        title={isSubscribed ? 'Subscribed' : 'Subscribe'}
        onPress={() => {}}
        isSubscribed={isSubscribed}
      />
    </View>
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
