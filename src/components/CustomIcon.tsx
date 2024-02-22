import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

type CustomIconProps = PropsWithChildren<{
  name: string;
  size: number;
  color: string;
}>;

export default function CustomIcon({name, size, color}: CustomIconProps) {
  return <Icon size={size} color={color} name={name} />;
}

const styles = StyleSheet.create({});
