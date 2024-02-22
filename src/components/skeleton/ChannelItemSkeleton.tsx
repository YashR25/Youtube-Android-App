import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {colors} from '../../utils/theme';

export default function ChannelItemSkeleton() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn();
  }, []);

  const fadeIn = () => {
    const fadeInComposite = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });

    Animated.loop(fadeInComposite).start();
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.channelInfo}>
        <View style={styles.imageWrapper}></View>
        <View style={styles.channelTitle} />
      </View>
      <View style={styles.button} />
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
    backgroundColor: colors.gray,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  channelInfo: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelTitle: {
    width: '50%',
    height: 20,
    backgroundColor: colors.gray,
  },
  button: {
    width: '30%',
    borderRadius: 30,
    height: 50,
    backgroundColor: colors.gray,
  },
});
