import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren, useState} from 'react';
import {playlistInterface} from '../../interfaces/user';
import {colors} from '../../utils/theme';
import CustomIcon from '../CustomIcon';
import {BottomNavigationProps, Menu, Provider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {RootParamList} from '../../App';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import {deletePlaylist} from '../../store/slices/PlaylistSlice';

type PlaylistItemProps = PropsWithChildren<{
  item: playlistInterface;
}>;

export default function PlaylistItem({item}: PlaylistItemProps) {
  const [visible, setVisible] = useState(false);
  const navigation =
    useNavigation<BottomTabNavigationProp<RootParamList, 'Library'>>();
  const dispatch = useDispatch<AppDispatch>();
  const onClose = () => {
    setVisible(false);
  };
  const onOpen = () => {
    setVisible(true);
  };
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate('PlaylistDetail', {playlistId: item._id});
      }}>
      <View style={styles.imageWrapper}>
        <View style={styles.overlay}>
          <CustomIcon name="indent" size={20} color={colors.text} />
          <Text style={{color: colors.text}}>{item.videos.length}</Text>
        </View>
        <Image
          style={styles.image}
          source={{
            uri:
              item.videos.length > 0
                ? item.videos[0]?.thumbnail?.url
                : 'https://i.pinimg.com/236x/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.jpg',
          }}
        />
      </View>
      <View style={styles.playlistDesc}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <Menu
          anchor={
            <Pressable
              onPress={() => {
                console.log('called');
                onOpen();
              }}
              style={{padding: 8}}>
              <CustomIcon name="ellipsis-v" size={20} color={colors.text} />
            </Pressable>
          }
          style={{backgroundColor: colors.darkGray}}
          visible={visible}
          onDismiss={onClose}>
          <Menu.Item
            onPress={() => dispatch(deletePlaylist(item._id))}
            title="Delete Playlist"
          />
        </Menu>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    margin: 8,
    gap: 10,
    paddingVertical: 8,
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 8,
    flexDirection: 'row',
    bottom: 10,
    right: 10,
    zIndex: 5,
    gap: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  playlistDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.gray,
    fontWeight: 'bold',
  },
});
