import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import VideoItem from '../components/video/VideoItem';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {RootParamList} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {getAllVideos} from '../store/slices/mainReducer';
import VideoList from '../components/video/VideoList';
import {AppDispatch, RootState} from '../store/store';
import {colors} from '../utils/theme';
import VideoListSkeleton from '../components/skeleton/VideoListSkeleton';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import CustomBottomSheet from '../components/CustomBottomSheet/CustomBottomSheet';
import AllPlaylist from '../components/playlist/AllPlaylist';

type HomeProps = BottomTabScreenProps<RootParamList, 'Home'>;

export default function Home({navigation, route}: HomeProps) {
  const videos = useSelector((state: RootState) => state.mainReducer.videos);
  const hasNextPage = useSelector(
    (state: RootState) => state.mainReducer.hasNextPage,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(false);

  const open = () => {
    bottomSheetRef.current?.present();
  };

  const getData = () => {
    try {
      setLoading(true);
      dispatch(getAllVideos({page: page, limit: limit}));
      setPage(prev => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //can handle onfocus usng navigation.addlistener
    getData();
  }, []);

  const handleRefresh = () => {
    try {
      setRefreshing(true);
      dispatch(getAllVideos({page: 1, limit: 2}));
      setPage(1);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!videos || videos.length < 0) {
    return (
      <View style={styles.container}>
        <VideoListSkeleton horizontal={false} size={2} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoList
        listEmptyComponent={() => (
          <Text
            style={{
              color: colors.gray,
              fontWeight: 'bold',
              alignSelf: 'center',
            }}>
            No videos found
          </Text>
        )}
        onEndReach={() => {
          if (hasNextPage) getData();
        }}
        footerComponent={() => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {loading && <ActivityIndicator size={50} color={colors.text} />}
            </View>
          );
        }}
        headerComponent={() => <></>}
        data={videos}
        horizontal={false}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        shouldShowSubscriberButton={true}
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
});
