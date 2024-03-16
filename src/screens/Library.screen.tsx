import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
  const [refreshing, setRefreshing] = useState(false);
  const [likePage, setLikePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [limit, setLimit] = useState(3);

  const onRefresh = useCallback(() => {
    console.log('refresh called');
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  console.log('watchHistory', watchHistory);
  console.log('playlist', playlists);

  const getLikeData = (page: number, limit: number) => {
    dispatch(getLikedVideos({page: page, limit: limit}));
    setLikePage(prev => prev + 1);
  };

  const getWatchHistoryData = (page: number, limit: number) => {
    dispatch(getWatchHistory({page: page, limit: limit}));
    setHistoryPage(prev => prev + 1);
  };

  const getPlaylistData = () => {
    if (user) dispatch(getAllPlaylists(user?._id));
  };

  const dispatch = useDispatch<AppDispatch>();

  const getData = () => {
    getLikeData(1, 3);
    getWatchHistoryData(1, 3);
    getPlaylistData();
  };
  useEffect(() => {
    getData();
  }, []);

  if (!watchHistory.data || !likedVideos.data) {
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

  console.log('library', likedVideos);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={{flex: 1}}>
        <Text style={styles.title}>Watch History</Text>
        {watchHistory.data.length > 0 ? (
          <FlatList
            pagingEnabled
            data={watchHistory.data}
            renderItem={({item, index}) => (
              <MiniVideoItem
                video={item}
                onPress={() =>
                  navigation.navigate('VideoPlayback', {videoId: item._id})
                }
                key={item._id}
              />
            )}
            onEndReached={() => {
              if (watchHistory.hasNextPage)
                getWatchHistoryData(historyPage, limit);
            }}
            horizontal
          />
        ) : (
          <EmptyItem text="No watch history yet" />
        )}
        <Text style={styles.title}>Liked Videos</Text>
        {likedVideos.data.length > 0 ? (
          <FlatList
            data={likedVideos.data}
            pagingEnabled
            renderItem={({item, index}) => (
              <MiniVideoItem
                video={item.video}
                onPress={() =>
                  navigation.navigate('VideoPlayback', {
                    videoId: item.video._id,
                  })
                }
                key={item._id}
              />
            )}
            onEndReached={() => {
              if (likedVideos.hasNextPage) getLikeData(likePage, limit);
            }}
            horizontal
          />
        ) : (
          <EmptyItem text="No liked videos yet" />
        )}
        <Text style={styles.title}>Playlists</Text>
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
    </ScrollView>
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
