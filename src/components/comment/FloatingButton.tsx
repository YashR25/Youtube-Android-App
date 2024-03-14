import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import {colors} from '../../utils/theme';
import CustomIcon from '../CustomIcon';
import {TouchableOpacity} from 'react-native-gesture-handler';

type FloatingButtonProps = PropsWithChildren<{
  onVideoPress: () => void;
  onTweetPress: () => void;
}>;

export default function FloatingButton({
  onVideoPress,
  onTweetPress,
}: FloatingButtonProps) {
  const [icon_1] = useState(new Animated.Value(16));
  const [icon_2] = useState(new Animated.Value(16));

  const [pop, setPop] = useState(false);

  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 90,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 160,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 16,
      duration: 300,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 16,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  return (
    // <View style={styles.container}>
    <>
      <Animated.View
        style={[styles.container, styles.floatingButton, {bottom: icon_2}]}>
        <TouchableOpacity onPress={() => onTweetPress()}>
          <CustomIcon name="edit" size={20} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[styles.container, styles.floatingButton, {bottom: icon_1}]}>
        <TouchableOpacity onPress={() => onVideoPress()}>
          <CustomIcon name="video-camera" size={20} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>
      <Pressable
        style={[styles.container, styles.floatingButton]}
        onPress={() => (pop === false ? popIn() : popOut())}>
        <CustomIcon name="plus" color="white" size={20} />
      </Pressable>
    </>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
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
