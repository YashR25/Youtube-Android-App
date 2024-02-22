import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import ChannelItem from '../components/channel/ChannelItem';
import MiniVideoItem from '../components/video/MiniVideoItem';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {getLikedVideos, getWatchHistory} from '../store/slices/LibrarySlice';
import {colors} from '../utils/theme';
import MiniVideoItemSkeleton from '../components/skeleton/MiniVideoItemSkeleton';

export default function Library() {
  const watchHistory = useSelector(
    (state: RootState) => state.LibraryReducer.watchHistory,
  );
  const likedVideos = useSelector(
    (state: RootState) => state.LibraryReducer.likedVideos,
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getWatchHistory());
    dispatch(getLikedVideos());
  }, []);

  if (watchHistory.length <= 0 || likedVideos.length <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Watch History</Text>
        <FlatList
          horizontal
          data={[1, 2, 3]}
          renderItem={({index}) => <MiniVideoItemSkeleton key={index} />}
        />
        <Text style={styles.title}>Liked Videos</Text>
        <FlatList
          horizontal
          data={[1, 2, 3]}
          renderItem={({index}) => <MiniVideoItemSkeleton key={index} />}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <ChannelItem channel={{}} /> */}
      <Text style={styles.title}>Watch History</Text>
      {watchHistory.length > 0 && (
        <FlatList
          data={watchHistory}
          renderItem={({item, index}) => (
            <MiniVideoItem video={item} onPress={() => {}} />
          )}
          horizontal
        />
      )}
      <Text style={styles.title}>Liked Videos</Text>
      <FlatList
        data={likedVideos}
        renderItem={({item, index}) => (
          <MiniVideoItem video={item.video} onPress={() => {}} />
        )}
        horizontal
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    color: colors.text,
    paddingHorizontal: 8,
  },
});
