import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  clamp,
  withClamp,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import PlayerWidget from './PlayerScreen';
import {snapPoint, useTiming, withBouncing} from 'react-native-redash';
import CustomBottomtab from './CustomBottomtab';
import {colors} from '../../utils/theme';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {
  CurrentPlayingVideoInterface,
  getVideoById,
} from '../../store/slices/videoPlaybackSlice';
import Video from 'react-native-video';
import {altAddTrack, setupPlayer} from '../../services/PlaybackService';
import {BACKEND_URL} from '@env';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import CustomVideoAlt from '../CustomVideoAlt';
import CustomVideo from '../CustomVideo';
import VideoPlayer from './VideoPlayer';

const {width, height} = Dimensions.get('window');
const SNAP_TOP = 0;
export const MINIMIZED_PLAYER_HEIGHT = 80;
export const SNAP_BOTTOM = height - MINIMIZED_PLAYER_HEIGHT - 60;

// type BottomPlayerProps = PropsWithChildren<{
//   onDismiss: () => void;
//   onTranslationYChange: (translateY: SharedValue<number>) => void;
// }>;

export default function BottomPlayer({
  onDismiss,
  state,
  descriptors,
  navigation,
  shouldShowPlayer,
}: any) {
  const translationY = useSharedValue(SNAP_BOTTOM);
  const contextY = useSharedValue(0);
  const velocityY = useSharedValue(0);
  const snapPointY = [0, SNAP_BOTTOM];
  const isExpanded = useSharedValue(false);
  const [expanded, setExpanded] = useState(true);
  const [goUp, setGoUp] = useState(false);
  const [goDown, setGoDown] = useState(false);
  const video = useSelector((state: RootState) => state.videoReducer.video);

  const isFullScreenVideo = useSharedValue(false);

  const config = {
    damping: 25,
    mass: 1,
    stiffness: 80,
    overshootClamping: false,
    restSpeedThreshold: 0.1,
    restDisplacementThreshold: 0.1,
  };

  useEffect(() => {
    if (goUp) {
      translationY.value = withTiming(SNAP_TOP, {duration: 300});
      setGoUp(false);
      setExpanded(true);
    } else if (goDown) {
      translationY.value = withTiming(SNAP_BOTTOM, {duration: 300});
      setGoDown(false);
      setExpanded(false);
    }
  }, [goUp, goDown]);

  useEffect(() => {
    if (shouldShowPlayer) setGoUp(true);
  }, [shouldShowPlayer]);

  const pan = Gesture.Pan()
    .onBegin(event => {
      contextY.value = translationY.value;
    })
    .onChange(event => {
      if (!isFullScreenVideo.value) {
        translationY.value = contextY.value + event.translationY;
        velocityY.value = event.velocityY;
      }
    })
    .onEnd(event => {
      if (!isFullScreenVideo.value) {
        const snapPoints = snapPoint(
          translationY.value,
          event.velocityY,
          snapPointY,
        );
        translationY.value = withClamp(
          {min: SNAP_TOP, max: SNAP_BOTTOM},
          withSpring(snapPoints, {
            ...config,
            velocity: event.velocityY,
          }),
        );
        if (translationY.value === SNAP_BOTTOM && event.translationY >= 50) {
          translationY.value = 800;
          runOnJS(onDismiss)();
        }
        if (snapPoints === 0) {
          isExpanded.value = true;
          runOnJS(setExpanded)(true);
        } else {
          isExpanded.value = false;
          runOnJS(setExpanded)(false);
        }
      }
    });

  const animatedBottomPlayerStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(
        translationY.value,
        [SNAP_BOTTOM / 1.5, SNAP_BOTTOM],
        [0, 1],
      ),
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  const animatedCardStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      width: isFullScreenVideo.value
        ? height
        : interpolate(
            translationY.value,
            [SNAP_BOTTOM, SNAP_BOTTOM / 1.5],
            [100, width],
            Extrapolation.CLAMP,
          ),
      height: isFullScreenVideo.value
        ? width
        : interpolate(
            translationY.value,
            [SNAP_BOTTOM, SNAP_TOP],
            [MINIMIZED_PLAYER_HEIGHT, height / 3],
            Extrapolation.CLAMP,
          ),
    };
  });

  const animatedBottomTabStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(translationY.value, [SNAP_BOTTOM, 0], [60, 0]),
    };
  });

  // if (!video) {
  //   return;
  // }

  // console.log('fullscreen', fullScreen);

  return (
    <>
      {shouldShowPlayer && (
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                height: '100%',
                backgroundColor: colors.background,
              },
              animatedStyle,
            ]}>
            <PlayerWidget />
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: isFullScreenVideo.value
                    ? height
                    : MINIMIZED_PLAYER_HEIGHT,
                },
              ]}>
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: 'row',
                }}
                onPress={() => setGoUp(true)}>
                <Animated.View
                  style={[
                    {
                      backgroundColor: colors.text,
                      overflow: 'hidden',
                      borderColor: 'white',
                      borderWidth: 1,
                    },
                    // fullScreen
                    //   ? {width: height, height: width}
                    //   :
                    animatedCardStyle,
                  ]}>
                  <VideoPlayer
                    expanded={expanded}
                    onFullScreen={(isFullScreen: boolean) => {
                      isFullScreenVideo.value = isFullScreen;
                    }}
                  />
                </Animated.View>
                <Animated.View
                  style={[
                    animatedBottomPlayerStyle,
                    {flex: 1, padding: 8, gap: 8},
                  ]}>
                  {video && <Text style={{color: 'white'}}>{video.title}</Text>}
                  {video && (
                    <Text style={{color: 'white'}}>{video.owner.username}</Text>
                  )}
                </Animated.View>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      )}

      <Animated.View
        style={[
          {backgroundColor: colors.background, zIndex: 1},
          animatedBottomTabStyle,
        ]}>
        <CustomBottomtab
          state={state}
          descriptors={descriptors}
          navigation={navigation}
        />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({});
