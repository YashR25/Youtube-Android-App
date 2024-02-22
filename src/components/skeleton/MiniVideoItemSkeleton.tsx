import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {colors} from '../../utils/theme';

export default function MiniVideoItemSkeleton() {
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
      <View style={styles.imageWrapper}></View>
      <View style={styles.text} />
    </Animated.View>
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
    backgroundColor: colors.gray,
  },
  text: {
    fontWeight: 'bold',
    height: 10,
    backgroundColor: colors.gray,
    width: '50%',
  },
});
