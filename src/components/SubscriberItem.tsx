import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, isValidElement} from 'react';
import Profile from './channel/Profile';
import {colors} from '../utils/theme';

type SubscriberItemProps = PropsWithChildren<{
  isSelected: boolean;
  onPress: () => void;
}>;

export default function SubscriberItem({
  isSelected,
  onPress,
}: SubscriberItemProps) {
  return (
    <Pressable
      style={[styles.container, isSelected && {backgroundColor: colors.gray}]}
      onPress={onPress}>
      <Profile onPress={() => {}} />
      <Text style={styles.text}>Lorem</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  text: {
    color: '#000000',
    fontWeight: 'bold',
    marginVertical: 8,
  },
});
