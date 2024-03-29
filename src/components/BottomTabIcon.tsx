import ADIcon from 'react-native-vector-icons/AntDesign';

import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {colors} from '../utils/theme';

type IconsProps = PropsWithChildren<{
  name: string;
  size: number;
  color: string;
  focused: boolean;
  title: string;
}>;

const Icon = new Map();
Icon.set('Home', 'home');
Icon.set('Trending', 'linechart');
Icon.set('Subscription', 'youtube');
Icon.set('Library', 'folder1');

//bottom tab icons
export default function BottomTabIcon({
  name,
  size,
  color,
  focused,
  title,
}: IconsProps) {
  return (
    <View style={[styles.container, focused && styles.focused]}>
      <ADIcon
        name={Icon.get(title)}
        size={size}
        color={focused ? 'red' : color}
        style={styles.icon}
      />
      {focused && <Text style={styles.text}>{title}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  focused: {
    borderRadius: 15,
    backgroundColor: colors.darkGray,
  },
  text: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
  focusedText: {
    color: 'red',
  },
  icon: {
    marginRight: 5,
    fontWeight: 'bold',
  },
});
