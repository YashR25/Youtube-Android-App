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
    <Provider>
      <Pressable
        style={styles.container}
        onPress={() => {
          navigation.navigate('PlaylistDetail', {playlistId: item._id});
        }}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={{uri: item.videos[0].thumbnail.url}}
          />
        </View>
        <View style={styles.playlistDesc}>
          <View>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
          <Menu
            anchor={
              <Pressable onPress={onOpen}>
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
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {},
  imageWrapper: {
    width: 100,
    height: 100,
    overflow: 'hidden',
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  playlistDesc: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
  },
  desc: {
    color: colors.gray,
  },
});
