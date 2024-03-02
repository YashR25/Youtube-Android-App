import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RoundedImage from '../components/RoundedImage';
import {
  MaterialTopTabScreenProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import TopTabVideos from '../components/TopTab/TopTabVideos';
import TopTabTweets from '../components/TopTab/TopTabTweets';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {
  addToVideos,
  getChannelStats,
  setPendingUploads,
  setUploadingProgress,
} from '../store/slices/channelSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import FloatingButton from '../components/comment/FloatingButton';
import {colors} from '../utils/theme';
import {launchImageLibrary} from 'react-native-image-picker';
import mime from 'mime';
import axiosClient from '../utils/axiosClient';
import UploadingScreen from './UploadingScreen.screen';
import {useIsFocused} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

type ProfileScreenProps = NativeStackScreenProps<RootParamList, 'Profile'>;

function TopTabTweetsRoot() {
  return (
    <View style={{flex: 1}}>
      <TopTabTweets isProfile={true} />
    </View>
  );
}

export default function ProfileScreen({navigation, route}: ProfileScreenProps) {
  const dispach = useDispatch<AppDispatch>();
  const channelStats = useSelector(
    (state: RootState) => state.channelReducer.channelStats,
  );
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const videoToUpload = useSelector(
    (state: RootState) => state.channelReducer.pendingUploads,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const isFocus = useIsFocused();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispach(getChannelStats());
    });
    return unsubscribe;
  }, []);

  const publishPendingVideoHandler = async () => {
    console.log('called publishvideohandler');
    if (route.params.shouldUpload && videoToUpload) {
      const formData = new FormData();
      formData.append('video', {
        uri: videoToUpload.videoUri,
        type: mime.getType(videoToUpload.videoUri),
        name: videoToUpload.videoUri.split('/').pop(),
      });
      formData.append('title', videoToUpload.title);
      formData.append('description', videoToUpload.desc);
      formData.append('thumbnail', {
        uri: videoToUpload.imageUri,
        type: mime.getType(videoToUpload.imageUri),
        name: videoToUpload.imageUri.split('/').pop(),
      });
      try {
        setIsLoading(false);
        const res = await axiosClient.post(`/api/v1/video/publish/`, formData, {
          onUploadProgress: ({loaded, total}) => {
            console.log(Math.round((loaded * 100) / total!!));
            const progress = Math.round((loaded * 100) / total!!);
            // setProgress(progress);
            dispach(setUploadingProgress(progress));
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('upload res', res);
        const video = res.data.data;
        dispach(setPendingUploads(null));
        dispach(addToVideos(video));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    publishPendingVideoHandler();
  }, [route.params.shouldUpload, isFocus]);

  const videoPickerHandler = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        selectionLimit: 1,
      });
      console.log(result);
      if (result.assets && result.assets[0]?.uri) {
        navigation.navigate('PublishVideo', {videoUri: result.assets[0].uri});
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!channelStats) {
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={50} color={colors.text} />
    </View>;
  }

  return (
    <View style={styles.container}>
      <FloatingButton
        onPress={() => {
          videoPickerHandler();
        }}
      />
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: user?.coverImage,
          }}
          style={styles.image}
        />
      </View>
      <View style={styles.channelItem}>
        <Pressable style={styles.channelImage}>
          {user && <RoundedImage url={user?.avatar} size={100} />}
        </Pressable>
        <View style={styles.channelInfo}>
          <Text style={[styles.title, styles.text]}>{user?.fullName}</Text>
          <Text style={styles.text}>{user?.username}</Text>
          <View>
            <Text style={styles.text}>
              {channelStats?.subscribersCount} Subscribers
            </Text>
            <Text style={styles.text}>{channelStats?.totalVideos} Videos</Text>
          </View>
        </View>
      </View>
      <Tab.Navigator
        initialRouteName={'Videos'}
        style={{flex: 1}}
        screenOptions={{
          tabBarStyle: {backgroundColor: colors.background},
          tabBarLabelStyle: {color: colors.text},
          tabBarIndicatorStyle: {backgroundColor: colors.primary},
        }}>
        <Tab.Screen name="Videos" component={TopTabVideos} />
        <Tab.Screen name="Tweets" component={TopTabTweetsRoot} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 8,
  },
  imageWrapper: {
    height: '20%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  channelItem: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  channelImage: {
    // marginTop: -60,
  },
  channelInfo: {},
  text: {
    color: colors.text,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
});
