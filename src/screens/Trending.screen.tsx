import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {getTrendingVideos} from '../store/slices/trendingSlice';
import VideoList from '../components/video/VideoList';
import RoundedImage from '../components/RoundedImage';
import {colors} from '../utils/theme';
import VideoListSkeleton from '../components/skeleton/VideoListSkeleton';

export default function Trending() {
  const dispatch = useDispatch<AppDispatch>();
  const trendingVideos = useSelector(
    (state: RootState) => state.trendingReducer.trendingData,
  );
  useEffect(() => {
    dispatch(getTrendingVideos());
  }, []);

  let videoList = <VideoListSkeleton size={5} horizontal={false} />;

  if (trendingVideos) {
    videoList = <VideoList data={trendingVideos} horizontal={false} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <RoundedImage
          url={'https://cdn-icons-png.flaticon.com/512/1946/1946430.png'}
          size={50}
        />
        <Text style={styles.title}>Trending</Text>
      </View>
      {videoList}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    color: colors.text,
    marginLeft: 8,
  },
});
