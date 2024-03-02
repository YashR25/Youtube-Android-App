import {StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {playlistInterface} from '../../interfaces/user';
import PlaylistItem from './PlaylistItem';

type PlaylistListProps = PropsWithChildren<{
  data: playlistInterface[];
}>;

export default function PlaylistList({data}: PlaylistListProps) {
  return (
    <FlatList
      data={data}
      renderItem={({index, item}) => (
        <PlaylistItem key={item._id} item={item} />
      )}
      horizontal
    />
  );
}

const styles = StyleSheet.create({});
