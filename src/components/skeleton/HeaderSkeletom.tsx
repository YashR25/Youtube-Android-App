import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import CommonIcon from '../CommonIcon';
import {colors} from '../../utils/theme';

export default function HeaderSkeletom() {
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
    <View style={[styles.container]}>
      <CommonIcon
        name="search"
        size={20}
        onPress={() => {}}
        color={colors.text}
      />
      <Animated.View style={[styles.image, {opacity: fadeAnim}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: colors.gray,
    borderRadius: 50,
  },
});
