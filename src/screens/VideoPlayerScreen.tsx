import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import {altAddTrack, setupPlayer} from '../services/PlaybackService';
import {BACKEND_URL} from '@env';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {
  getVideoById,
  getVideoComments,
  setCurrentVideo,
  toggleLike,
} from '../store/slices/videoPlaybackSlice';
import {getPlaylistDetails} from '../store/slices/PlaylistSlice';
import TrackPlayer, {
  Event,
  State,
  Track,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {colors} from '../utils/theme';
import Video from 'react-native-video';
import CustomVideoAlt from '../components/CustomVideoAlt';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CommonIcon from '../components/CommonIcon';
import {videoInterface} from '../interfaces/video';
import {commentInterface} from '../interfaces/user';
import {Menu} from 'react-native-paper';
import ChannelItem from '../components/channel/ChannelItem';
import TopComment from '../components/comment/TopComment';
import MiniVideoItem from '../components/video/MiniVideoItem';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import PlaylistBottomSeet from '../components/playlist/PlaylistBottomSeet';
import {addVideoToWatchHistory} from '../store/slices/appConfigSlice';

type VideoPlayerScreenProps = NativeStackScreenProps<
  RootParamList,
  'VideoPlayerScreen'
>;

export default function VideoPlayerScreen({
  route,
  navigation,
}: VideoPlayerScreenProps) {
  const videoId = route.params.videoId;
  const playlistId = route.params.playlistId;
  const dispatch = useDispatch<AppDispatch>();
  const video = useSelector((state: RootState) => state.videoReducer.video);
  const playlist = useSelector(
    (state: RootState) => state.playlistReducer.currentPlaylist,
  );
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<
    number | null
  >(null);
  const {position, duration} = useProgress();
  const [isCompleted, setIsCompleted] = useState(false);
  const videoRef = useRef<Video>(null);
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);
  const commentBottomSheetRef = useRef<BottomSheetModal>(null);
  const commnetSnapPoints = useMemo(() => ['70%'], []);

  const user = useSelector((state: RootState) => state.appConfigReducer.user);

  const comments: commentInterface[] | null = useSelector(
    (state: RootState) => state.videoReducer.comments,
  );
  const videos: videoInterface[] | null = useSelector(
    (state: RootState) => state.mainReducer.videos,
  );
  const isLiked: boolean = useSelector(
    (state: RootState) => state.videoReducer.isLiked,
  );
  useEffect(() => {
    return () => {
      dispatch(setCurrentVideo(null));
    };
  }, []);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const openMenu = () => {
    setIsMenuVisible(true);
  };
  const closeMenu = () => {
    setIsMenuVisible(false);
  };

  const showCommentBottomSheetHandler = () => {
    commentBottomSheetRef.current?.present();
  };

  const playlistBottomSeetRef = useRef<BottomSheetModal>(null);

  const openPlaylistBottomSheet = () => {
    playlistBottomSeetRef.current?.present();
  };

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
      if (video && videoId) {
        const videoFileToAdd = {
          publicId: video.videoFile.publicId,
          url: getVideoUrl(video.videoFile.url),
        };
        await altAddTrack([{...video, videoFile: videoFileToAdd}]);
      } else if (playlistId && playlist && !video) {
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
      }
    }

    setIsPlayerReady(isSetup);
  }

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

  useEffect(() => {
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
    } else if (playlistId) {
      dispatch(getPlaylistDetails(playlistId));
    }
  }, [videoId, playlistId]);

  useEffect(() => {
    setup();
    if (video) {
      dispatch(addVideoToWatchHistory(video._id));
      dispatch(getVideoComments(video._id));
    }
  }, [video]);

  // console.log(video?.title);

  useEffect(() => {
    // console.log('called cureindex');
    const fetchVideo = async () => {
      // console.log('called fetchvideo', currentPlaylistIndex);
      if (currentPlaylistIndex !== null && currentPlaylistIndex >= 0) {
        const id = playlist?.videos[currentPlaylistIndex]?._id;
        console.log('id', id);
        if (id !== undefined) dispatch(getVideoById(id));
      }
    };
    fetchVideo();
  }, [currentPlaylistIndex]);

  // console.log('currentPlaylistIndex', currentPlaylistIndex);

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
          console.log('called track changed');
          const index = event.index;
          if (index !== undefined && index >= 0) {
            setCurrentPlaylistIndex(index);
          }
          setPlayingTrack(event.track ? event.track : null);
          break;
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

  const upNextVideos = playlist?.videos.filter((video, index) => {
    return (
      index !== currentPlaylistIndex &&
      currentPlaylistIndex !== null &&
      index > currentPlaylistIndex
    );
  });

  const handleOnMiniVideoItemClick = async (
    index: number,
    video: videoInterface,
  ) => {
    if (playlist) {
      await TrackPlayer.skip(index);
    } else {
      await TrackPlayer.reset();
      dispatch(getVideoById(video._id));
    }
  };

  if (!video) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <PlaylistBottomSeet
        currentSelectedVideo={video._id}
        ref={playlistBottomSeetRef}
      />
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          {video && playingTrack ? (
            <CustomVideoAlt
              onFullScreen={(isFullScreen: boolean) => {}}
              shouldShowControl={true}
              isPlaying={isPlaying}
              playingTrack={playingTrack}
              togglePlayback={togglePlaybackHandler}
              handlePause={handlePause}
              handlePlay={handlePlay}
              ref={videoRef}
              seekTo={seekTo}
            />
          ) : (
            <View
              style={{
                height: '30%',
                backgroundColor: colors.background,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size={50} color={colors.text} />
            </View>
          )}
          {/* <Video source={{uri: video?.videoFile.url}} /> */}
          <View style={{height: '70%', padding: 8}}>
            <ScrollView>
              <View style={styles.videoDescContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title} numberOfLines={2}>
                    {video?.title}
                  </Text>
                  <CommonIcon
                    name="chevron-down"
                    size={20}
                    color={colors.text}
                    onPress={() => {}}
                  />
                </View>
                <View style={styles.videoStats}>
                  <Text style={styles.desc}>400k views</Text>
                  <Text style={styles.desc}>15 hours ago</Text>
                </View>
                <View style={styles.likeContainer}>
                  <CommonIcon
                    name={isLiked ? 'thumbs-up' : 'thumbs-o-up'}
                    size={20}
                    color={colors.text}
                    onPress={() => {
                      dispatch(toggleLike(video._id));
                    }}
                  />
                  <CommonIcon
                    name="thumbs-o-down"
                    size={20}
                    color={colors.text}
                    onPress={() => {}}
                  />
                  <CommonIcon
                    name="share"
                    size={20}
                    color={colors.text}
                    onPress={() => {}}
                  />
                  <Menu
                    visible={isMenuVisible}
                    onDismiss={closeMenu}
                    anchor={
                      // <Pressable onPress={openMenu}>
                      <CommonIcon
                        name="ellipsis-h"
                        size={20}
                        color={colors.text}
                        onPress={() => {
                          openMenu();
                        }}
                      />
                      // </Pressable>
                    }>
                    <Menu.Item
                      title="Add to Playlist"
                      onPress={() => {
                        setIsMenuVisible(false);
                        openPlaylistBottomSheet();
                      }}
                    />
                  </Menu>
                </View>
              </View>
              <ChannelItem
                channel={video.owner}
                isSubscribed={video.isSubscribed}
                visible={user?._id !== video.owner._id}
              />
              <TopComment
                videoId={video?._id}
                onPress={showCommentBottomSheetHandler}
              />
              <View style={styles.upNext}>
                <Text style={styles.title}>Up Next</Text>
                <FlatList
                  data={playlist ? playlist.videos : videos}
                  ListEmptyComponent={<Text>No Upcoming videos..</Text>}
                  renderItem={({item, index}) => (
                    <MiniVideoItem
                      key={item._id}
                      video={item}
                      onPress={() => {
                        handleOnMiniVideoItemClick(index, item);
                      }}
                    />
                  )}
                  horizontal
                />
              </View>
              {/* <CustomBottomSheet ref={bottomSheetRef} /> */}
              <BottomSheetModal
                ref={commentBottomSheetRef}
                index={0}
                snapPoints={commnetSnapPoints}
                backgroundStyle={{backgroundColor: colors.background}}
                handleIndicatorStyle={{backgroundColor: colors.text}}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    justifyContent: 'center',
                  }}>
                  {comments && comments?.length > 0 ? (
                    <CommentList comments={comments} />
                  ) : (
                    <Text style={{color: colors.gray, alignSelf: 'center'}}>
                      No comments yet
                    </Text>
                  )}
                  <CommentForm videoId={video._id} />
                </View>
              </BottomSheetModal>
            </ScrollView>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoWrapper: {
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoDescContainer: {
    padding: 8,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.text,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desc: {
    color: colors.gray,
    marginRight: 8,
  },
  upNext: {
    padding: 8,
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
});
