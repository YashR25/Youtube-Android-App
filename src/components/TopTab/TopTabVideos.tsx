import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {deleteVideo, getChannelVideos} from '../../store/slices/channelSlice';
import {videoInterface} from '../../interfaces/video';
import {togglePublishStatus} from '../../store/slices/channelSlice';
import {colors} from '../../utils/theme';
import PendingUploadItem from '../video/PendingUploadItem';
import {Menu} from 'react-native-paper';
import CustomIcon from '../CustomIcon';
import FooterLoadingComponent from '../FooterLoadingComponent';

type RenderItemProps = PropsWithChildren<{
  video: videoInterface;
  isProfile: boolean;
}>;

const RenderItem = ({video, isProfile}: RenderItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const toggleSwitch = () => {
    dispatch(togglePublishStatus(video._id));
  };
  const [visible, setVisible] = useState(false);
  const open = () => {
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };

  return (
    <Pressable style={styles.renderItemContainer}>
      {isProfile && (
        <Switch
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleSwitch}
          trackColor={{false: colors.gray, true: colors.primary}}
          value={video.isPublished}
        />
      )}
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={{uri: video?.thumbnail?.url}} />
      </View>
      <View style={styles.videoInfo}>
        <View style={{flex: 1}}>
          <Text
            style={[styles.title, styles.text]}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {video.title}
          </Text>
          <Text style={styles.text}>{video.views} Views</Text>
          <Text style={[styles.text]} numberOfLines={1} ellipsizeMode="tail">
            {video.description}
          </Text>
        </View>
        {isProfile && (
          <Menu
            anchor={
              <Pressable onPress={open} style={{padding: 8}}>
                <CustomIcon name="ellipsis-v" size={20} color={colors.text} />
              </Pressable>
            }
            visible={visible}
            onDismiss={close}>
            <Menu.Item
              title="delete"
              onPress={() => {
                Alert.alert(
                  'delete video',
                  'are you sure you want to delete video!!',
                  [
                    {
                      text: 'delete',
                      onPress: () => {
                        setVisible(false);
                        dispatch(deleteVideo(video._id));
                      },
                    },
                    {
                      text: 'cancel',
                      onPress: () => {},
                    },
                  ],
                );
              }}
            />
          </Menu>
        )}
      </View>
    </Pressable>
  );
};

type TopTabVideosProps = PropsWithChildren<{
  userId: string | undefined;
}>;

export default function TopTabVideos({userId}: TopTabVideosProps) {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector((state: RootState) => state.channelReducer.videos);
  const pendingUpload = useSelector(
    (state: RootState) => state.channelReducer.pendingUploads,
  );
  const user = useSelector((state: RootState) => state.appConfigReducer.user);

  const isProfile = useMemo(() => {
    if (user) return user._id === userId;
  }, [user, userId]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  console.log('user', userId);

  const getData = () => {
    setLoading(true);
    if (userId) {
      dispatch(getChannelVideos({page: page, limit: limit, userId: userId}));
      setPage(prev => prev + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [userId]);

  const handleRefresh = () => {
    try {
      setRefreshing(true);
      if (userId)
        dispatch(getChannelVideos({page: 1, limit: 5, userId: userId}));
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  console.log('top tab', videos.data);

  if (!videos) {
    return (
      <View
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <ActivityIndicator size={50} color={colors.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {pendingUpload && (
        <View style={{marginBottom: 8}}>
          <Text
            style={{color: colors.gray, fontWeight: 'bold', marginVertical: 8}}>
            Uploading...
          </Text>
          <PendingUploadItem item={pendingUpload} />
        </View>
      )}
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={videos.data}
        onEndReached={() => {
          if (videos.hasNextPage) {
            getData();
          }
        }}
        ListFooterComponent={() => loading && <FooterLoadingComponent />}
        renderItem={({item, index}) => (
          <RenderItem isProfile={isProfile!!} video={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.background,
  },
  renderItemContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  imageWrapper: {
    overflow: 'hidden',
    borderRadius: 20,
    height: 100,
    width: 100,
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  text: {
    color: colors.text,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  videoInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
