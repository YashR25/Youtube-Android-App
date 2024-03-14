import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CustomBottomtab from './CustomBottomtab';
import BottomPlayer, {SNAP_BOTTOM} from './BottomPlayer';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {setShouldShowPlayer} from '../../store/slices/appConfigSlice';
import TrackPlayer from 'react-native-track-player';
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {colors} from '../../utils/theme';

export default function TabWithPlayer({state, descriptors, navigation}: any) {
  const shouldShowPlayer = useSelector(
    (state: RootState) => state.appConfigReducer.shouldShowPlayer,
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <BottomPlayer
        shouldShowPlayer={shouldShowPlayer}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
        onDismiss={() => {
          TrackPlayer.reset();
          dispatch(setShouldShowPlayer(false));
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({});
