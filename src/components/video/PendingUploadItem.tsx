import {Image, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import {pendingUploadsInterface} from '../../store/slices/channelSlice';
import {colors} from '../../utils/theme';
import * as Progress from 'react-native-progress';

type PendingUploadItemProps = PropsWithChildren<{
  item: pendingUploadsInterface;
}>;

export default function PendingUploadItem({item}: PendingUploadItemProps) {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.progressOverlay}>
          <Progress.Pie
            color={'rgba(100,100,100,0.5)'}
            size={50}
            progress={item.progress}
          />
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{uri: item.imageUri}} style={styles.image} />
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    flexDirection: 'row',
    gap: 10,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    overflow: 'hidden',
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: colors.text,
  },
  desc: {
    color: colors.gray,
  },
  progressOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 5,
  },
});
