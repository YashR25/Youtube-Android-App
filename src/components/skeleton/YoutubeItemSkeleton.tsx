import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import ChannelItemSkeleton from './ChannelItemSkeleton';
import {colors} from '../../utils/theme';

export default function YoutubeItemSkeleton() {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    fadeIn();
  }, []);

  const fadeIn = () => {
    const fadeInComposite = Animated.timing(fadeAnim, {
      toValue: 0.6,
      duration: 500,
      useNativeDriver: true,
    });

    Animated.loop(fadeInComposite).start();
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View style={styles.imageWrapper} />
      <View style={styles.videoDescContainer}>
        <View style={styles.titleContainer}>
          <View style={styles.title} />
        </View>
        <View style={styles.videoStats}></View>
      </View>
      <ChannelItemSkeleton />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  imageWrapper: {
    borderRadius: 30,
    height: 200,
    overflow: 'hidden',
    backgroundColor: colors.gray,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoDescContainer: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    width: '50%',
    height: 20,
    backgroundColor: colors.gray,
  },
  menu: {},
  desc: {
    marginRight: 8,
  },
  videoStats: {
    width: '30%',
    height: 20,
    marginVertical: 8,
    backgroundColor: colors.gray,
  },
});
