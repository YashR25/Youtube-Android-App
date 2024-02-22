import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import ChannelItem from '../components/channel/ChannelItem';
import CommonIcon from '../components/CommonIcon';
import MiniVideoItem from '../components/video/MiniVideoItem';
import {useDispatch, useSelector} from 'react-redux';
import {
  getVideoById,
  getVideoComments,
  setCurrentVideo,
  toggleLike,
} from '../store/slices/videoPlaybackSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import {AppDispatch, RootState} from '../store/store';
import {videoInterface} from '../interfaces/video';
import TopComment from '../components/comment/TopComment';
import {commentInterface} from '../interfaces/user';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import CommentItem from '../components/comment/CommentItem';
import CustomVideo from '../components/CustomVideo';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';

type VideoPlaybackProps = NativeStackScreenProps<
  RootParamList,
  'VideoPlayback'
>;

export default function VideoPlayback({navigation, route}: VideoPlaybackProps) {
  const videoID = route.params.videoId;
  const dispatch = useDispatch<AppDispatch>();

  const video: videoInterface | null = useSelector(
    (state: RootState) => state.videoReducer.video,
  );
  const comments: [commentInterface] | null = useSelector(
    (state: RootState) => state.videoReducer.comments,
  );
  const videos: [videoInterface] | [] = useSelector(
    (state: RootState) => state.mainReducer.videos,
  );
  const isLiked: boolean = useSelector(
    (state: RootState) => state.videoReducer.isLiked,
  );
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['70%'], []);
  const showBottomSheetHandler = () => {
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    dispatch(getVideoById(videoID));
    dispatch(getVideoComments(videoID));
  }, [route.params.videoId]);

  useEffect(() => {
    return () => {
      dispatch(setCurrentVideo(null));
    };
  }, []);

  if (!video) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        {video && <CustomVideo video={video} />}
        <View style={{height: '70%'}}>
          <ScrollView>
            <View style={styles.videoDescContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={2}>
                  {video?.title}
                </Text>
                <CommonIcon
                  name="chevron-down"
                  size={20}
                  color="#000000"
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
                  color="#000000"
                  onPress={() => {
                    dispatch(toggleLike(video._id));
                  }}
                />
                {/* <CommonIcon
                  name="thumbs-o-down"
                  size={20}
                  color="#000000"
                  onPress={() => {}}
                /> */}
                <CommonIcon
                  name="share"
                  size={20}
                  color="#000000"
                  onPress={() => {}}
                />
                <CommonIcon
                  name="ellipsis-h"
                  size={20}
                  color="#000000"
                  onPress={() => {}}
                />
              </View>
            </View>
            <ChannelItem
              channel={video?.owner}
              isSubscribed={video?.isSubscribed!!}
            />
            <TopComment videoId={video?._id} onPress={showBottomSheetHandler} />
            <View style={styles.upNext}>
              <Text style={styles.title}>Up Next</Text>
              <FlatList
                data={videos}
                renderItem={({item, index}) => (
                  <MiniVideoItem
                    key={item._id}
                    video={item}
                    onPress={() => {
                      dispatch(setCurrentVideo(video));
                    }}
                  />
                )}
                horizontal
              />
            </View>
            {/* <CustomBottomSheet ref={bottomSheetRef} /> */}
            <BottomSheetModal
              ref={bottomSheetRef}
              index={0}
              snapPoints={snapPoints}>
              <View
                style={{
                  flex: 1,
                }}>
                {comments && comments?.length > 0 && (
                  <CommentList comments={comments} />
                )}
                <CommentForm videoId={video._id} />
              </View>
            </BottomSheetModal>
          </ScrollView>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'scroll',
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
    color: '#000000',
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desc: {
    color: '#4d4c4c',
    marginRight: 8,
  },
  upNext: {
    paddingHorizontal: 8,
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
