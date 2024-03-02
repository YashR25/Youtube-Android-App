import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const open = () => {
    bottomSheetRef.current?.present();
  };
  useEffect(() => {
    //can handle onfocus usng navigation.addlistener
    dispatch(getAllVideos());
  }, []);

  const handleRefresh = () => {
    try {
      setRefreshing(true);
      dispatch(getAllVideos());
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
