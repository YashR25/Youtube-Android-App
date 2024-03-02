import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {colors} from '../../utils/theme';
import CustomIcon from '../CustomIcon';

type AllPlaylistProps = PropsWithChildren<{
  onPress: (playlistId: string) => void;
}>;

export default function AllPlaylist({onPress}: AllPlaylistProps) {
  const playlists = useSelector(
    (state: RootState) => state.LibraryReducer.playlists,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Save Video To..</Text>
        <Pressable style={{flexDirection: 'row', gap: 10}}>
          <CustomIcon name="plus" size={10} color={colors.primary} />
          <Text>New Playlist</Text>
        </Pressable>
      </View>
      <FlatList
        data={playlists}
        renderItem={({index, item}) => (
          <Pressable onPress={() => onPress(item._id)}>
            <Text style={{color: colors.text}}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.text,
  },
  text: {
    color: colors.text,
  },
});
