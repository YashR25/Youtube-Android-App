import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import Video from 'react-native-video';

type VideoPlayerProps = PropsWithChildren<{
  width: number;
  height: number;
  url: string;
}>;

export default function VideoPlayer({width, height, url}: VideoPlayerProps) {
  return (
    <View style={[styles.videoWrapper]}>
      <Video
        source={url ? {uri: url} : require('../assets/sample.mp4')}
        style={styles.video}
        resizeMode="cover"
        controls
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoWrapper: {
    height: '30%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
