import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {PropsWithChildren} from 'react';

type ProfileProps = PropsWithChildren<{
  onPress: () => void;
  size: number;
  url: string;
}>;

export default function Profile({onPress, size, url}: ProfileProps) {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <View
        style={[
          styles.imageWrapper,
          size ? {width: size, height: size} : null,
        ]}>
        <Image
          source={{
            uri: url
              ? url
              : 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
          }}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
  imageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e3e1e1',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});
