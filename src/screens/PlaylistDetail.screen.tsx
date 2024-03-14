import {
  Alert,
  Button,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import CustomIcon from '../components/CustomIcon';
import LinearGradient from 'react-native-linear-gradient';
import {setCurrentPlayingVideo} from '../store/slices/videoPlaybackSlice';
import {setShouldShowPlayer} from '../store/slices/appConfigSlice';

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
  const [thumbnail, setThumbnail] = useState('');
  useEffect(() => {
    if (playlist) setThumbnail(playlist.videos[0].thumbnail.url);
  }, [playlist]);
  const onRemoveVideoFromPlaylist = (videoId: string) => {
    Alert.alert(
      'Removing video from playlist',
      'Are you sure you want to remove video from playlist?',
      [
        {
          text: 'remove',
          onPress: () => {
            if (playlist) {
              if (videoId === playlist.videos[0]._id) {
                setThumbnail(playlist.videos[1]._id);
              }
              dispatch(
                deleteVideoFromPlaylist({
                  videoId: videoId,
                  playlistId: playlist?._id,
                }),
              );
            }
          },
        },
      ],
    );
  };
  useEffect(() => {
    dispatch(getPlaylistDetails(route.params.playlistId));
  }, [route.params.playlistId]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <View
          style={[
            styles.playlistInfoContainer,
            // {borderWidth: 1, borderColor: 'red'},
          ]}>
          {/* <LinearGradient
            colors={['rgba(0,0,0,0)', colors.background]}
            style={{flex: 1}}> */}
          <ImageBackground
            style={{flex: 1}}
            imageStyle={styles.bgImage}
            resizeMode="cover"
            blurRadius={7}
            source={{
              uri: thumbnail
                ? thumbnail
                : 'https://t4.ftcdn.net/jpg/03/16/15/47/360_F_316154790_pnHGQkERUumMbzAjkgQuRvDgzjAHkFaQ.jpg',
            }}>
            <LinearGradient
              colors={['rgba(0,0,0,0)', colors.background]}
              style={[styles.background]}>
              <View style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  source={{
                    uri: thumbnail
                      ? thumbnail
                      : 'https://t4.ftcdn.net/jpg/03/16/15/47/360_F_316154790_pnHGQkERUumMbzAjkgQuRvDgzjAHkFaQ.jpg',
                  }}
                />
              </View>
              <Text style={[styles.title]}>{playlist?.name}</Text>
              <Text style={styles.videoCount}>
                {playlist?.videos.length} videos
              </Text>
              <Text style={[styles.videoCount, {fontWeight: 'bold'}]}>
                Created by {playlist?.owner.fullName}
              </Text>
              <Pressable
                style={styles.button}
                onPress={() => {
                  // navigation.navigate('VideoPlayerScreen', {
                  //   videoId: null,
                  //   playlistId: route.params.playlistId,
                  // })
                  dispatch(
                    setCurrentPlayingVideo({
                      isPlaylist: true,
                      playlistId: playlist?._id,
                      videoId: null,
                    }),
                  );
                  dispatch(setShouldShowPlayer(true));
                }}>
                <CustomIcon name="play" size={15} color={colors.background} />
                <Text style={{color: colors.background}}>Play all</Text>
              </Pressable>
            </LinearGradient>
          </ImageBackground>
          {/* </LinearGradient> */}
        </View>
        <View style={styles.videosContainer}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  playlistInfoContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 16,
  },
  bgImage: {
    opacity: 0.8,
  },
  videosContainer: {
    // flex: 1,
    padding: 8,
    backgroundColor: colors.background,
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
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
  },
  videoCount: {
    color: colors.gray,
  },
  button: {
    backgroundColor: colors.text,
    borderRadius: 20,
    marginVertical: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonText: {
    color: colors.background,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
