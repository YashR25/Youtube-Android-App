import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {PropsWithChildren, useEffect, useRef, useState} from 'react';
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

type CustomVideoProps = PropsWithChildren<{
  video: videoInterface | null;
}>;

export default function CustomVideo({video}: CustomVideoProps) {
  const [clicked, setClicked] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);
  const playbackState = usePlaybackState();
  const [playingTrack, setPlayingTrack] = useState<Track | null>();
  const {position, duration} = useProgress();
  const [isCompleted, setIsCompleted] = useState(false);

  async function setup() {
    let isSetup = await setupPlayer();

    if (isSetup) {
      if (video) await addTrack(video!!);
    }

    setIsPlayerReady(isSetup);
  }

  useEffect(() => {
    setup();
    return () => {
      TrackPlayer.remove([0]);
    };
  }, []);

  const toggleClicked = () => {
    setClicked(prev => !prev);
  };

  const toggleFullScreen = () => {
    if (fullScreen) {
      Orientation.lockToPortrait();
    } else {
      Orientation.lockToLandscape();
    }
    setFullScreen(prev => !prev);
  };

  const togglePlaybackHandler = async () => {
    const currentTrack = await TrackPlayer.getActiveTrack();
    if (currentTrack !== null) {
      if (
        playbackState.state == State.Paused ||
        playbackState.state == State.Ready
      ) {
        handlePlay();
      } else {
        handlePause();
      }
    }
  };

  const handlePause = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    if (isCompleted) {
      seekTo(0);
    }
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  const seekTo = async (progress: number) => {
    await TrackPlayer.seekTo(progress);
    videoRef.current?.seek(progress);
  };

  useTrackPlayerEvents(
    [
      Event.PlaybackActiveTrackChanged,
      Event.RemotePlay,
      Event.RemotePause,
      Event.RemoteJumpForward,
      Event.RemoteJumpBackward,
      Event.PlaybackQueueEnded,
    ],
    async event => {
      switch (event.type) {
        case Event.PlaybackActiveTrackChanged:
          setPlayingTrack(event.track);
          // handlePlay();
          break;
        case Event.RemotePlay:
          setIsPlaying(true);
          break;
        case Event.RemotePause:
          setIsPlaying(false);
          break;
        case Event.RemoteJumpForward:
          seekTo(position + 2);
          break;
        case Event.RemoteJumpBackward:
          seekTo(position - 2);
          break;
        case Event.PlaybackQueueEnded:
          handlePause();
          setIsCompleted(true);
          break;
      }
    },
  );

  const [loading, setLoading] = useState(false);

  return (
    <View style={[styles.videoWrapper, {height: fullScreen ? '100%' : '30%'}]}>
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
          source={{uri: playingTrack?.url}}
          style={[styles.video]}
          resizeMode="cover"
          fullscreen={fullScreen}
          ref={videoRef}
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
          poster={video?.thumbnail.url}
          posterResizeMode="cover"
          onPlaybackResume={() => {
            handlePlay();
            setLoading(false);
          }}
        />
      </Pressable>
      {clicked && (
        <Pressable style={styles.videoControlOverlay} onPress={toggleClicked}>
          <View style={styles.controlCenter}>
            <Pressable onPress={() => seekTo(position - 10)}>
              <CustomIcon name="fast-backward" size={20} color="white" />
            </Pressable>
            <Pressable onPress={togglePlaybackHandler}>
              <CustomIcon
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={20}
                color="white"
              />
            </Pressable>
            <Pressable onPress={() => seekTo(position + 10)}>
              <CustomIcon name="fast-forward" size={20} color="white" />
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
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
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
}

const styles = StyleSheet.create({
  videoWrapper: {
    overflow: 'hidden',
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
    gap: 10,
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
