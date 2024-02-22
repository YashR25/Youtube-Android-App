import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import VideoItem from '../components/video/VideoItem';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootParamList} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {getAllVideos} from '../store/slices/mainReducer';
import VideoList from '../components/video/VideoList';
import {AppDispatch, RootState} from '../store/store';
import {colors} from '../utils/theme';
import VideoListSkeleton from '../components/skeleton/VideoListSkeleton';

type HomeProps = BottomTabScreenProps<RootParamList, 'Home'>;

export default function Home({navigation, route}: HomeProps) {
  const videos = useSelector((state: RootState) => state.mainReducer.videos);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllVideos());
  }, []);

  if (!videos || videos.length <= 0) {
    return (
      <View style={styles.container}>
        <VideoListSkeleton horizontal={false} size={2} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoList data={videos} horizontal={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: colors.background,
  },
});
