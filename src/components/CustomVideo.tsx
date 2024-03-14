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

  const getVideoUrl = useCallback(
    (url: string) => {
      if (url && url.split('//').length > 1 && url.split('//')[0] === 'http:') {
        return url;
      } else {
        return `${BACKEND_URL}/${url}`;
      }
    },
    [video],
  );

  async function setup() {
    let isSetup = await setupPlayer();

    if (isSetup) {
      if (video) {
        const videoFileToAdd = {
          publicId: video.videoFile.publicId,
          url: getVideoUrl(video.videoFile.url),
        };
        await addTrack({...video, videoFile: videoFileToAdd});
      }
    }

    setIsPlayerReady(isSetup);
  }

  useEffect(() => {
    setup();
    return () => {
      TrackPlayer.reset();
    };
  }, [video]);

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

  if (!playingTrack) {
    return (
      <View
        style={{height: '30%', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={50} color={colors.text} />
      </View>
    );
  }

  return (
    <View style={[styles.videoWrapper, {height: '100%'}]}>
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
              <CustomIcon name="fast-backward" size={25} color={colors.text} />
            </Pressable>
            <Pressable onPress={togglePlaybackHandler}>
              <CustomIcon
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={40}
                color={colors.text}
              />
            </Pressable>
            <Pressable onPress={() => seekTo(position + 10)}>
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
}

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
