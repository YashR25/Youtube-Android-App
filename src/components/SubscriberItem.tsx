import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, isValidElement} from 'react';
import Profile from './channel/Profile';
import {colors} from '../utils/theme';

type SubscriberItemProps = PropsWithChildren<{
  isSelected: boolean;
  onPress: () => void;
  url: string;
  title: string;
}>;

export default function SubscriberItem({
  isSelected,
  onPress,
  url,
  title,
}: SubscriberItemProps) {
  return (
    <Pressable
      style={[styles.container, isSelected && {backgroundColor: colors.gray}]}
      onPress={onPress}>
      <Profile onPress={onPress} size={50} url={url} />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  text: {
    color: colors.text,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});
