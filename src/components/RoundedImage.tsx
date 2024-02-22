import {Image, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';

type RoundedImageProps = PropsWithChildren<{
  size: number;
  url: string;
}>;

export default function RoundedImage({size, url}: RoundedImageProps) {
  return (
    <View
      style={[
        styles.imageWrapper,
        {height: size, width: size, borderRadius: size / 2},
      ]}>
      <Image source={{uri: url}} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
