import {Alert, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import {videoInterface} from '../../interfaces/video';
import {colors} from '../../utils/theme';
import {Menu} from 'react-native-paper';
import CustomIcon from '../CustomIcon';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {deleteVideoFromPlaylist} from '../../store/slices/PlaylistSlice';

type PlaylistVideoItemProps = PropsWithChildren<{
  video: videoInterface;
  onRemoveVideo: (videoId: string) => void;
}>;

export default function PlaylistVideoItem({
  video,
  onRemoveVideo,
}: PlaylistVideoItemProps) {
  const [visible, setVisible] = useState(false);

  const onOpen = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image source={{uri: video.thumbnail.url}} style={styles.image} />
      </View>
      <View style={styles.videoDetail}>
        <View>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            {video.title}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.desc}>
            {video.description}
          </Text>
        </View>
        <Menu
          visible={visible}
          anchor={
            <Pressable
              onPress={() => {
                onOpen();
              }}>
              <CustomIcon name="ellipsis-v" size={20} color={colors.text} />
            </Pressable>
          }
          onDismiss={onClose}>
          <Menu.Item title="remove" onPress={() => onRemoveVideo(video._id)} />
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 20,
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
  desc: {
    color: colors.gray,
  },
  videoDetail: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
