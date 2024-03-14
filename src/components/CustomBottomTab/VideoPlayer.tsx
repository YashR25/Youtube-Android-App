import {StyleSheet, Text, View} from 'react-native';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {getVideoById} from '../../store/slices/videoPlaybackSlice';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Video from 'react-native-video';
import {BACKEND_URL} from '@env';
import {altAddTrack, setupPlayer} from '../../services/PlaybackService';
import CustomVideoAlt from '../CustomVideoAlt';
import {getPlaylistDetails} from '../../store/slices/PlaylistSlice';

type VideoPlayerProps = PropsWithChildren<{
  expanded: boolean;
  onFullScreen: (isFullScreen: boolean) => void;
}>;

export default function VideoPlayer({
  expanded,
  onFullScreen,
}: VideoPlayerProps) {
  const currentPlayingVideo = useSelector(
    (state: RootState) => state.videoReducer.currentPlayingVideo,
  );
  const dispatch = useDispatch<AppDispatch>();
  const playbackState = usePlaybackState();
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  const {position, duration} = useProgress();

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

  const seekTo = async (progress: number) => {
    await TrackPlayer.seekTo(progress);
    videoRef.current?.seek(progress);
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

  const video = useSelector((state: RootState) => state.videoReducer.video);
  const playlist = useSelector(
    (state: RootState) => state.playlistReducer.currentPlaylist,
  );

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
    if (isSetup && currentPlayingVideo) {
      if (
        currentPlayingVideo.isPlaylist &&
        !currentPlayingVideo.videoId &&
        playlist
      ) {
        const playlistToBeAdded = playlist.videos.map(video => {
          return {
            ...video,
            videoFile: {
              publicId: video.videoFile.publicId,
              url: getVideoUrl(video.videoFile.url),
            },
          };
        });
        await altAddTrack(playlistToBeAdded);
        dispatch(getVideoById(playlist.videos[0]._id));
      } else if (
        currentPlayingVideo.isPlaylist &&
        currentPlayingVideo.videoId &&
        playlist
      ) {
        const index = playlist.videos.findIndex(
          video => video._id === currentPlayingVideo.videoId,
        );
        if (index !== -1) await TrackPlayer.skip(index);
      } else if (video) {
        await TrackPlayer.reset();
        const videoFileToAdd = {
          publicId: video.videoFile.publicId,
          url: getVideoUrl(video.videoFile.url),
        };
        await altAddTrack([{...video, videoFile: videoFileToAdd}]);
      }
    }
  }

  useEffect(() => {
    setup();
  }, [playlist, video]);

  useEffect(() => {
    if (currentPlayingVideo) {
      if (currentPlayingVideo.videoId) {
        dispatch(getVideoById(currentPlayingVideo.videoId));
      }
      if (
        currentPlayingVideo.isPlaylist &&
        currentPlayingVideo.playlistId &&
        !currentPlayingVideo.videoId
      ) {
        dispatch(getPlaylistDetails(currentPlayingVideo.playlistId));
      }
    }
  }, [currentPlayingVideo]);

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
          setPlayingTrack(event.track ? event.track : null);
        case Event.RemotePlay:
          console.log('called remote play');
          setIsPlaying(true);
          // handlePlay();
          break;
        case Event.RemotePause:
          console.log('called remote pause');
          setIsPlaying(false);
          // handlePause();
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

  return (
    <>
      {playingTrack && (
        <CustomVideoAlt
          handlePause={handlePause}
          handlePlay={handlePlay}
          isPlaying={isPlaying}
          onFullScreen={onFullScreen}
          playingTrack={playingTrack}
          seekTo={seekTo}
          shouldShowControl={expanded}
          togglePlayback={togglePlaybackHandler}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
