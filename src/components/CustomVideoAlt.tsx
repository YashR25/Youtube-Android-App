import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';
import {videoInterface} from '../interfaces/video';
import {RootState} from '../store/store';
import Video, {OnBufferData, OnProgressData} from 'react-native-video';
import CustomIcon from './CustomIcon';
import Orientation from 'react-native-orientation-locker';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {addTrack, setupPlayer} from '../services/PlaybackService';
import Slider from '@react-native-community/slider';
import {colors} from '../utils/theme';
import {BACKEND_URL} from '@env';

type CustomVideoProps = PropsWithChildren<{
  togglePlayback: () => void;
  handlePlay: () => void;
  handlePause: () => void;
  seekTo: (progress: number) => void;
  isPlaying: boolean;
  playingTrack: Track;
  shouldShowControl: boolean;
  onFullScreen: (isFullScreen: boolean) => void;
}>;

export default React.forwardRef(
  (
    {
      togglePlayback,
      handlePause,
      handlePlay,
      seekTo,
      isPlaying,
      playingTrack,
      shouldShowControl,
      onFullScreen,
    }: CustomVideoProps,
    ref,
  ) => {
    const [clicked, setClicked] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const {position, duration} = useProgress();

    const toggleClicked = () => {
      setClicked(prev => !prev);
    };

    const toggleFullScreen = () => {
      if (fullScreen) {
        Orientation.lockToPortrait();
        onFullScreen(false);
      } else {
        Orientation.lockToLandscape();
        onFullScreen(true);
      }
      setFullScreen(prev => !prev);
    };

    const [loading, setLoading] = useState(false);

    return (
      <View
        style={[
          styles.videoWrapper,
          // {height: fullScreen ? '100%' : '30%'},
          {height: '100%', width: '100%', borderColor: 'red', borderWidth: 1},
        ]}>
        {loading && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={50} color={'white'} />
          </View>
        )}
        <Pressable onPress={toggleClicked}>
          <Video
            source={{uri: playingTrack.url}}
            style={[styles.video]}
            resizeMode="cover"
            fullscreen={fullScreen}
            ref={ref as React.RefObject<Video>}
            paused={!isPlaying}
            onProgress={(progress: OnProgressData) => {
              TrackPlayer.seekTo(progress.currentTime);
            }}
            onPlaybackStalled={() => {
              handlePause();
              setLoading(true);
            }}
            onBuffer={() => console.log('onBuffer')}
            onVideoBuffer={() => console.log('onVideoBuffer')}
            onLoad={() => {
              setLoading(false);
              handlePlay();
            }}
            onLoadStart={() => setLoading(true)}
            poster={playingTrack.artwork}
            posterResizeMode="cover"
            onPlaybackResume={() => {
              handlePlay();
              setLoading(false);
            }}
          />
        </Pressable>
        {shouldShowControl && clicked && (
          <Pressable style={styles.videoControlOverlay} onPress={toggleClicked}>
            <View style={styles.controlCenter}>
              <Pressable onPress={() => seekTo(position - 2)}>
                <CustomIcon
                  name="fast-backward"
                  size={25}
                  color={colors.text}
                />
              </Pressable>
              <Pressable onPress={togglePlayback}>
                <CustomIcon
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={40}
                  color={colors.text}
                />
              </Pressable>
              <Pressable onPress={() => seekTo(position + 2)}>
                <CustomIcon name="fast-forward" size={25} color={colors.text} />
              </Pressable>
            </View>
            <Pressable style={styles.fullScreenIcon} onPress={toggleFullScreen}>
              <CustomIcon
                name={fullScreen ? 'compress' : 'expand'}
                size={20}
                color={'white'}
              />
            </Pressable>
            <View style={styles.seekContainer}>
              <Text style={styles.timeStamp}>
                {new Date(position * 1000).toISOString().substring(15, 19)}
              </Text>
              <Slider
                style={{width: '70%', height: 40}}
                minimumValue={0}
                maximumValue={duration}
                minimumTrackTintColor={colors.text}
                maximumTrackTintColor={colors.gray}
                thumbTintColor={colors.primary}
                value={position}
                onValueChange={(progress: number) => {
                  seekTo(progress);
                }}
              />
              <Text style={styles.timeStamp}>
                {new Date(duration * 1000).toISOString().substring(15, 19)}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  videoWrapper: {
    overflow: 'hidden',
    // aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControlOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
  },
  fullScreenIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  controlCenter: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  seekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
  },
  timeStamp: {
    color: 'white',
    fontWeight: 'bold',
  },
});
