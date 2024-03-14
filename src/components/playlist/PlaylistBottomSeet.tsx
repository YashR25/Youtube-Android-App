import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {PropsWithChildren, useRef, useState} from 'react';
import CustomBottomSheet from '../CustomBottomSheet/CustomBottomSheet';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store';
import AllPlaylist from './AllPlaylist';
import {
  addVideoToPlaylist,
  createPlaylist,
} from '../../store/slices/PlaylistSlice';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {colors} from '../../utils/theme';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

type PlaylistBottomSeetProps = PropsWithChildren<{
  currentSelectedVideo: string;
}>;

export default React.forwardRef(
  ({currentSelectedVideo}: PlaylistBottomSeetProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [playlistName, setPlaylistName] = useState('');
    const [desc, setDesc] = useState('');
    const [playlistId, setPlaylistId] = useState('');

    return (
      <>
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}>
          <Pressable
            style={styles.modalContainer}
            onPress={() => {
              setIsModalVisible(false);
            }}>
            <View style={styles.modalView}>
              <TextInput
                placeholder="Type title"
                value={playlistName}
                onChangeText={setPlaylistName}
                style={styles.input}
              />
              <TextInput
                placeholder="Type description"
                value={desc}
                onChangeText={setDesc}
                style={styles.input}
              />
              <Button
                title="Create Playlist"
                onPress={() => {
                  dispatch(
                    createPlaylist({
                      name: playlistName,
                      description: desc,
                      videoId: currentSelectedVideo,
                    }),
                  );
                }}
              />
            </View>
          </Pressable>
        </Modal>
        <CustomBottomSheet ref={ref} snapPoints={['25%', '50%']}>
          <AllPlaylist
            onNewPlaylistPress={() => {
              (ref as React.RefObject<BottomSheetMethods>).current?.close();
              setIsModalVisible(true);
            }}
            onPress={(playlistId: string) => {
              setPlaylistId(playlistId);
              dispatch(
                addVideoToPlaylist({
                  playlistId: playlistId,
                  videoId: currentSelectedVideo,
                }),
              );
            }}
          />
        </CustomBottomSheet>
      </>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    borderRadius: 20,
    height: 200,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: colors.darkGray,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 16,
  },
  input: {
    borderRadius: 10,
    backgroundColor: colors.gray,
    padding: 8,
  },
});
