import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../utils/theme';

type CommonIconProps = PropsWithChildren<{
  name: string;
  size: number;
  color: string;
  onPress: () => void;
}>;

export default function CommonIcon({
  name,
  size,
  color,
  onPress,
}: CommonIconProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <FAIcon name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkGray,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});
