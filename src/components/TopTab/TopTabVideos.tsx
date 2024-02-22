import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {getChannelVideos} from '../../store/slices/channelSlice';
import {videoInterface} from '../../interfaces/video';
import {togglePublishStatus} from '../../store/slices/channelSlice';
import {colors} from '../../utils/theme';

type RenderItemProps = PropsWithChildren<{
  video: videoInterface;
}>;

const RenderItem = ({video}: RenderItemProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const toggleSwitch = () => {
    dispatch(togglePublishStatus(video._id));
  };
  return (
    <Pressable style={styles.renderItemContainer}>
      <Switch
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        value={video.isPublished}
      />
      <View style={styles.imageWrapper}>
        <Image style={styles.image} source={{uri: video.thumbnail.url}} />
      </View>
      <View style={styles.videoInfo}>
        <Text style={[styles.title, styles.text]}>{video.title}</Text>
        <Text style={styles.text}>{video.views} Views</Text>
        <Text style={styles.text} numberOfLines={1}>
          {video.description}
        </Text>
      </View>
    </Pressable>
  );
};

export default function TopTabVideos() {
  const dispatch = useDispatch<AppDispatch>();
  const videos = useSelector((state: RootState) => state.channelReducer.videos);
  useEffect(() => {
    dispatch(getChannelVideos());
  }, []);

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
      <FlatList
        data={videos}
        renderItem={({item, index}) => <RenderItem video={item} />}
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
    gap: 20,
    alignItems: 'center',
    marginVertical: 8,
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
  videoInfo: {},
});
