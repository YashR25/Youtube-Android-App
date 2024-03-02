import {Button, Modal, StyleSheet, Text, TextInput, View} from 'react-native';
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
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TextInput
                value={playlistName}
                onChangeText={setPlaylistName}
                style={styles.input}
              />
              <TextInput
                value={desc}
                onChangeText={setDesc}
                style={styles.input}
              />
              <Button
                title="Create Playlist"
                onPress={() => {
                  try {
                    dispatch(
                      createPlaylist({name: playlistName, description: desc}),
                    );
                  } catch (error) {
                  } finally {
                    dispatch(
                      addVideoToPlaylist({
                        playlistId: playlistId,
                        videoId: currentSelectedVideo,
                      }),
                    );
                  }
                }}
              />
            </View>
          </View>
        </Modal>
        <CustomBottomSheet ref={ref} snapPoints={['25%', '50%']}>
          <AllPlaylist
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
  },
  modalView: {
    borderRadius: 20,
    backgroundColor: colors.darkGray,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 8,
  },
  input: {
    borderRadius: 20,
    backgroundColor: colors.background,
    padding: 8,
  },
});
