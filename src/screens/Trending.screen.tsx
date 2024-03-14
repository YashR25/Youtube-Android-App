import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {getTrendingVideos} from '../store/slices/trendingSlice';
import VideoList from '../components/video/VideoList';
import RoundedImage from '../components/RoundedImage';
import {colors} from '../utils/theme';
import VideoListSkeleton from '../components/skeleton/VideoListSkeleton';
import {RootParamList} from '../App';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import FooterLoadingComponent from '../components/FooterLoadingComponent';
import {load} from 'react-native-track-player/lib/trackPlayer';

type TrendingScreenProps = BottomTabScreenProps<RootParamList, 'Trending'>;

function HeaderComponent(): React.JSX.Element {
  return (
    <View style={styles.titleContainer}>
      <RoundedImage
        url={'https://cdn-icons-png.flaticon.com/512/1946/1946430.png'}
        size={50}
      />
      <Text style={styles.title}>Trending</Text>
    </View>
  );
}

export default function Trending({navigation}: TrendingScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const trendingVideos = useSelector(
    (state: RootState) => state.trendingReducer.trendingData,
  );
  const hasNextPage = useSelector(
    (state: RootState) => state.trendingReducer.hasNextPage,
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(false);

  const getData = () => {
    console.log('called');
    setLoading(true);
    dispatch(getTrendingVideos({page: page, limit: limit}));
    setPage(prev => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRefresh = () => {
    dispatch(getTrendingVideos({page: 1, limit: 2}));
  };

  console.log(trendingVideos?.length);

  let videoList = <VideoListSkeleton size={5} horizontal={false} />;

  if (trendingVideos) {
    videoList = (
      <VideoList
        footerComponent={() => (loading ? <FooterLoadingComponent /> : <></>)}
        onEndReach={() => {
          if (hasNextPage) getData();
        }}
        listEmptyComponent={() => (
          <Text
            style={{
              color: colors.gray,
              alignSelf: 'center',
              fontWeight: 'bold',
            }}>
            No videos found
          </Text>
        )}
        headerComponent={HeaderComponent}
        data={trendingVideos}
        horizontal={false}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        shouldShowSubscriberButton={true}
      />
    );
  }
  return <View style={styles.container}>{videoList}</View>;
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
