import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useRef, useState} from 'react';
import VideoItem from './VideoItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../App';
import {videoInterface} from '../../interfaces/video';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import CustomBottomSheet from '../CustomBottomSheet/CustomBottomSheet';
import AllPlaylist from '../playlist/AllPlaylist';
import {addVideoToPlaylist} from '../../store/slices/PlaylistSlice';
import PlaylistBottomSeet from '../playlist/PlaylistBottomSeet';

type VideoListProps = PropsWithChildren<{
  data: videoInterface[] | [];
  horizontal: boolean;
  handleRefresh: () => void;
  refreshing: boolean;
  headerComponent: () => React.JSX.Element;
  listEmptyComponent: () => React.JSX.Element;
  shouldShowSubscriberButton: boolean;
}>;

export default function VideoList({
  data,
  horizontal,
  handleRefresh,
  refreshing,
  headerComponent,
  listEmptyComponent,
  shouldShowSubscriberButton,
}: VideoListProps) {
  const navigation = useNavigation<BottomTabNavigationProp<RootParamList>>();
  const [currentSeletedVideo, setCurrentSeletedVideo] = useState('');
  const open = (id: string) => {
    setCurrentSeletedVideo(id);
    bottomSheetRef.current?.present();
  };
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  return (
    <>
      <PlaylistBottomSeet
        currentSelectedVideo={currentSeletedVideo}
        ref={bottomSheetRef}
      />
      <View style={styles.container}>
        <FlatList
          horizontal={horizontal}
          data={data}
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={listEmptyComponent}
          renderItem={({item, index}) => (
            <VideoItem
              key={item._id}
              video={item}
              shouldShowSubscriberButton={shouldShowSubscriberButton}
              onPress={() => {
                navigation.navigate('VideoPlayback', {videoId: item._id});
              }}
              onMenuItemPressed={() => open(item._id)}
            />
          )}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
