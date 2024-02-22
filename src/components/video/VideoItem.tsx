import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import Icons from '../BottomTabIcon';
import ChannelItem from '../channel/ChannelItem';
import {videoInterface} from '../../interfaces/video';
import {colors} from '../../utils/theme';
// import {useNavigation} from '@react-navigation/native';
// import {RootBottomTabParamList, RootStackParamList} from '../../App';
// import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';

type VideoItemProps = PropsWithChildren<{
  video: videoInterface;
  onPress: () => void;
}>;

export default function VideoItem({video, onPress}: VideoItemProps) {
  // const {navigation} =
  //   useNavigation<BottomTabScreenProps<RootBottomTabParamList>>();

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: video.thumbnail.url,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.videoDescContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {video.title}
          </Text>
          <View style={styles.menu}>
            <Icons
              name="ellipsis1"
              size={20}
              color={colors.text}
              focused={false}
              title=""
            />
          </View>
        </View>
        <View style={styles.videoStats}>
          <Text style={styles.desc}>{video.views} views</Text>
          <Text style={styles.desc}>{video.description}</Text>
        </View>
      </View>
      <ChannelItem channel={video.owner} isSubscribed={video.isSubscribed} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  imageWrapper: {
    borderRadius: 30,
    height: 200,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoDescContainer: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.text,
  },
  menu: {},
  desc: {
    color: colors.gray,
    marginRight: 8,
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
});
