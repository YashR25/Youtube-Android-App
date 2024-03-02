import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/theme';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import PendingUploadItem from '../components/video/PendingUploadItem';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';

export default function UploadingScreen() {
  const uploadingItem = useSelector(
    (state: RootState) => state.channelReducer.pendingUploads,
  );

  if (!uploadingItem) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: colors.gray, fontWeight: 'bold'}}>
          Not anything uploading now
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PendingUploadItem item={uploadingItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
