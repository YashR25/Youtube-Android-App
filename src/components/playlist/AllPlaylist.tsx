import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {PropsWithChildren, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {colors} from '../../utils/theme';
import CustomIcon from '../CustomIcon';
import {getAllPlaylists} from '../../store/slices/PlaylistSlice';

type AllPlaylistProps = PropsWithChildren<{
  onPress: (playlistId: string) => void;
  onNewPlaylistPress: () => void;
}>;

export default function AllPlaylist({
  onPress,
  onNewPlaylistPress,
}: AllPlaylistProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const playlists = useSelector(
    (state: RootState) => state.playlistReducer.playlists,
  );

  useEffect(() => {
    if (user) dispatch(getAllPlaylists(user._id));
  }, []);

  if (!playlists) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size={50} color={colors.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Save video to..</Text>
        <Pressable
          onPress={onNewPlaylistPress}
          style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
          <CustomIcon name="plus" size={10} color={colors.primary} />
          <Text style={{color: colors.primary}}>New Playlist</Text>
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
    paddingHorizontal: 16,
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
