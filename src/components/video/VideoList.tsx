import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import VideoItem from './VideoItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../../App';
import {videoInterface} from '../../interfaces/video';
import {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

type VideoListProps = PropsWithChildren<{
  data: [videoInterface] | [];
  horizontal: boolean;
}>;

export default function VideoList({data, horizontal}: VideoListProps) {
  const navigation = useNavigation<BottomTabNavigationProp<RootParamList>>();
  return (
    <View style={styles.container}>
      <FlatList
        horizontal={horizontal}
        data={data}
        renderItem={({item, index}) => (
          <VideoItem
            key={item._id}
            video={item}
            onPress={() => {
              navigation.navigate('VideoPlayback', {videoId: item._id});
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
