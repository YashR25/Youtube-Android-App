import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootParamList} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {
  deleteVideoFromPlaylist,
  getPlaylistDetails,
} from '../store/slices/PlaylistSlice';
import {colors} from '../utils/theme';
import PlaylistVideoItem from '../components/playlist/PlaylistVideoItem';
import Video from 'react-native-video';

type PlaylistDetailProps = BottomTabScreenProps<
  RootParamList,
  'PlaylistDetail'
>;

export default function PlaylistDetail({
  navigation,
  route,
}: PlaylistDetailProps) {
  const dispatch = useDispatch<AppDispatch>();
  const playlist = useSelector(
    (state: RootState) => state.playlistReducer.currentPlaylist,
  );
  const onRemoveVideoFromPlaylist = (videoId: string) => {
    Alert.alert(
      'Removing video from playlist',
      'Are you sure you want to remove video from playlist?',
    );
    if (playlist)
      dispatch(
        deleteVideoFromPlaylist({videoId: videoId, playlistId: playlist?._id}),
      );
  };
  useEffect(() => {
    dispatch(getPlaylistDetails(route.params.playlistId));
  }, [route.params.playlistId]);
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          style={styles.image}
          source={{uri: playlist?.videos[0].thumbnail.url}}
        />
      </View>
      <Text style={[styles.title]}>{playlist?.name}</Text>
      <Text style={styles.videoCount}>{playlist?.videos.length} videos</Text>
      <FlatList
        data={playlist?.videos}
        renderItem={({item, index}) => (
          <PlaylistVideoItem
            onRemoveVideo={onRemoveVideoFromPlaylist}
            video={item}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  title: {
    color: colors.text,
    fontWeight: 'bold',
  },
  videoCount: {
    color: colors.gray,
  },
});
