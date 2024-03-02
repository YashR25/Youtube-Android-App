import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import ChannelItem from '../components/channel/ChannelItem';
import MiniVideoItem from '../components/video/MiniVideoItem';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {getLikedVideos, getWatchHistory} from '../store/slices/LibrarySlice';
import {colors} from '../utils/theme';
import MiniVideoItemSkeleton from '../components/skeleton/MiniVideoItemSkeleton';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootParamList} from '../App';
import {getAllPlaylists} from '../store/slices/PlaylistSlice';
import PlaylistItem from '../components/playlist/PlaylistItem';

type LibraryScreenProps = BottomTabScreenProps<RootParamList, 'Library'>;

export default function Library({navigation}: LibraryScreenProps) {
  const watchHistory = useSelector(
    (state: RootState) => state.LibraryReducer.watchHistory,
  );
  const likedVideos = useSelector(
    (state: RootState) => state.LibraryReducer.likedVideos,
  );
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const playlists = useSelector(
    (state: RootState) => state.playlistReducer.playlists,
  );

  console.log('watchHistory', watchHistory);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(getWatchHistory());
      dispatch(getLikedVideos());
      if (user) dispatch(getAllPlaylists(user._id));
    });
    return unsubscribe;
  }, [navigation]);

  if (!watchHistory || !likedVideos) {
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
        <Text style={styles.title}>Playlists</Text>
        <FlatList
          horizontal
          data={[1, 2, 3]}
          renderItem={({index}) => <MiniVideoItemSkeleton key={index} />}
        />
      </View>
    );
  }

  function EmptyItem({text}: {text: string}) {
    return (
      <View
        style={{height: 200, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontWeight: 'bold', color: colors.gray}}>{text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Watch History</Text>
      {watchHistory.length > 0 ? (
        <FlatList
          pagingEnabled
          data={watchHistory}
          renderItem={({item, index}) => (
            <MiniVideoItem
              video={item}
              onPress={() =>
                navigation.navigate('VideoPlayback', {videoId: item._id})
              }
              key={item._id}
            />
          )}
          horizontal
        />
      ) : (
        <EmptyItem text="No watch history yet" />
      )}
      <Text style={styles.title}>Liked Videos</Text>
      {likedVideos.length > 0 ? (
        <FlatList
          data={likedVideos}
          pagingEnabled
          renderItem={({item, index}) => (
            <MiniVideoItem
              video={item.video}
              onPress={() =>
                navigation.navigate('VideoPlayback', {videoId: item.video._id})
              }
              key={item.video._id}
            />
          )}
          horizontal
        />
      ) : (
        <EmptyItem text="No liked videos yet" />
      )}
      <Text style={styles.title}>Playlista</Text>
      {playlists && playlists?.length > 0 ? (
        <FlatList
          data={playlists}
          renderItem={({item, index}) => (
            <PlaylistItem key={item._id} item={item} />
          )}
          pagingEnabled
          horizontal
        />
      ) : (
        <EmptyItem text="No Playlist created yet" />
      )}
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
