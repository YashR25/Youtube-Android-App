import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {colors} from '../../utils/theme';
import CustomIcon from '../CustomIcon';

type FloatingButtonProps = PropsWithChildren<{
  onPress: () => void;
}>;

export default function FloatingButton({onPress}: FloatingButtonProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.floatingButton} onPress={onPress}>
        <CustomIcon name="plus" color="white" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    right: 16,
    bottom: 16,
    zIndex: 5,
  },
  floatingButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100 / 2,
    backgroundColor: colors.primary,
  },
});
