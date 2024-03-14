import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {videoInterface} from '../../interfaces/video';
import {formatDuration} from '../../utils/utils';

type MiniVideoItemProps = PropsWithChildren<{
  video: videoInterface;
  onPress: () => void;
}>;

export default function MiniVideoItem({video, onPress}: MiniVideoItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: video?.thumbnail?.url,
          }}
          style={styles.image}
        />
        <View style={styles.timeStamp}>
          <Text style={styles.timeText}>
            {formatDuration(parseFloat(video?.duration))}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={styles.text}>
        {video?.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    margin: 8,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 150,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  text: {
    color: '#8c8c8c',
    fontWeight: 'bold',
  },
  timeStamp: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 20,
    marginTop: -40,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
