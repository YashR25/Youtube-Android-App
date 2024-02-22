import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import YoutubeItemSkeleton from './YoutubeItemSkeleton';

type VideoListProps = PropsWithChildren<{
  size: number;
  horizontal: boolean;
}>;

export default function VideoListSkeleton({size, horizontal}: VideoListProps) {
  //   let array: [number];
  const arraySkeleton = [1, 2];

  //   useEffect(() => {
  //     for (let i = 0; i < size; i++) {
  //       array.push(i);
  //     }
  //   }, []);

  return (
    <View>
      <FlatList
        horizontal={horizontal}
        data={arraySkeleton}
        renderItem={({index, item}) => <YoutubeItemSkeleton key={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
