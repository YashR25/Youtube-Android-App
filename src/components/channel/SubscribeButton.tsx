import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {colors} from '../../utils/theme';

type SubscribeButtonProps = PropsWithChildren<{
  title: string;
  onPress: () => void;
  isSubscribed: boolean;
}>;

export default function SubscribeButton({
  title,
  onPress,
  isSubscribed,
}: SubscribeButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isSubscribed && styles.subscribed]}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  subscribed: {
    backgroundColor: colors.gray,
  },
});
