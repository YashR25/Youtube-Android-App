import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {colors} from '../../utils/theme';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {
  getVideoComments,
  setCurrentPlayingVideo,
  setCurrentVideo,
  toggleLike,
} from '../../store/slices/videoPlaybackSlice';
import CommonIcon from '../CommonIcon';
import {Menu} from 'react-native-paper';
import ChannelItem from '../channel/ChannelItem';
import TopComment from '../comment/TopComment';
import MiniVideoItem from '../video/MiniVideoItem';
import CommentForm from '../comment/CommentForm';
import CommentList from '../comment/CommentList';
import {videoInterface} from '../../interfaces/video';

const {height} = Dimensions.get('window');

export default function PlayerWidget() {
  const video = useSelector((state: RootState) => state.videoReducer.video);
  const isLiked = useSelector((state: RootState) => state.videoReducer.isLiked);
  const playlist = useSelector(
    (state: RootState) => state.playlistReducer.currentPlaylist,
  );
  const videos = useSelector((state: RootState) => state.mainReducer.videos);
  const comments = useSelector(
    (state: RootState) => state.videoReducer.comments,
  );
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const dispatch = useDispatch<AppDispatch>();

  const commentBottomSheetRef = useRef<BottomSheetModal>(null);
  const commnetSnapPoints = useMemo(() => ['70%'], []);

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

  const handleOnMiniVideoItemClick = async (
    index: number,
    video: videoInterface,
  ) => {
    if (playlist) {
      dispatch(
        setCurrentPlayingVideo({
          isPlaylist: true,
          playlistId: playlist._id,
          videoId: video._id,
        }),
      );
    } else {
      dispatch(
        setCurrentPlayingVideo({
          isPlaylist: false,
          playlistId: null,
          videoId: video._id,
        }),
      );
    }
  };

  useEffect(() => {
    if (video) dispatch(getVideoComments(video?._id));
  }, [video]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentVideo(null));
    };
  }, []);

  if (!video) {
    return;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <BottomSheetModalProvider>
        <View style={{height: height / 3}} />
        <View
          style={{
            height: '70%',
            padding: 8,
          }}>
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
    </View>
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
