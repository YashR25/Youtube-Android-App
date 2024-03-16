import {
  ActivityIndicator,
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
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
  getChannelStatsById,
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
import notifee from '@notifee/react-native';
import {addTweet} from '../store/slices/tweetSlice';

const Tab = createMaterialTopTabNavigator();

type ProfileScreenProps = NativeStackScreenProps<RootParamList, 'Profile'>;

// function TopTabTweetsRoot() {
//   return (
//     <View style={{flex: 1}}>
//       <TopTabTweets isProfile={true} />
//     </View>
//   );
// }

export default function ProfileScreen({navigation, route}: ProfileScreenProps) {
  const dispach = useDispatch<AppDispatch>();

  const channelStats = useSelector(
    (state: RootState) => state.channelReducer.channelStats,
  );
  const user = useSelector((state: RootState) => state.appConfigReducer.user);
  const userId = route.params.userId ? route.params.userId : user?._id;
  const videoToUpload = useSelector(
    (state: RootState) => state.channelReducer.pendingUploads,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const isFocus = useIsFocused();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tweet, setTweet] = useState('');

  useEffect(() => {
    dispach(getChannelStatsById(userId!!));
  }, []);

  const altPublish = async () => {
    notifee.registerForegroundService(notification => {
      return new Promise(async () => {
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
            const res = await axiosClient.post(
              `/api/v1/video/publish/`,
              formData,
              {
                onUploadProgress: ({loaded, total}) => {
                  console.log(Math.round((loaded * 100) / total!!));
                  const progress = Math.round((loaded * 100) / total!!);
                  // setProgress(progress);
                  notifee.displayNotification({
                    id: notification.id,
                    title: notification.title,
                    android: {
                      ...notification.android,
                      progress: {
                        max: 100,
                        current: progress,
                      },
                    },
                  });
                  dispach(setUploadingProgress(progress));
                },
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );
            console.log('upload res', res);
            const video = res.data.data;
            dispach(setPendingUploads(null));
            dispach(addToVideos(video));
          } catch (error) {
            console.log(error);
          } finally {
            await notifee.stopForegroundService();
            setIsLoading(false);
          }
        }
      });
    });

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    notifee.displayNotification({
      title: 'uploading...',
      android: {
        channelId: channelId,
        progress: {
          max: 100,
          current: 0,
        },
        asForegroundService: true,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

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
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size={50} color={colors.text} />
      </View>
    );
  }

  return (
    <>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <Pressable
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onPress={() => setIsModalVisible(false)}>
          <View
            style={{
              height: 200,
              width: '80%',
              borderRadius: 20,
              padding: 8,
              backgroundColor: colors.darkGray,
              justifyContent: 'center',
            }}>
            <TextInput
              value={tweet}
              onChangeText={setTweet}
              style={{
                padding: 8,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: colors.gray,
              }}
              placeholder="Type tweet here.."
            />
            <Button
              title="Post"
              onPress={() => {
                dispach(addTweet(tweet));
                setIsModalVisible(false);
              }}
            />
          </View>
        </Pressable>
      </Modal>
      <View style={styles.container}>
        {!isLoading && (
          <FloatingButton
            onVideoPress={() => {
              videoPickerHandler();
            }}
            onTweetPress={() => setIsModalVisible(true)}
          />
        )}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: channelStats.coverImage,
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.channelItem}>
          <Pressable style={styles.channelImage}>
            {channelStats && (
              <RoundedImage url={channelStats?.avatar} size={100} />
            )}
          </Pressable>
          <View style={styles.channelInfo}>
            <Text style={[styles.title, styles.text]}>
              {channelStats?.fullName}
            </Text>
            <Text style={styles.text}>{channelStats?.username}</Text>
            <View>
              <Text style={styles.text}>
                {channelStats?.subscribersCount} Subscribers
              </Text>
              <Text style={styles.text}>
                {channelStats?.totalVideos} Videos
              </Text>
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
          <Tab.Screen
            name="Videos"
            children={() => <TopTabVideos userId={channelStats?._id} />}
          />
          <Tab.Screen
            name="Tweets"
            children={() => (
              <TopTabTweets
                isProfile={user?._id === channelStats._id}
                userId={channelStats._id}
              />
            )}
          />
        </Tab.Navigator>
      </View>
    </>
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
