import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../utils/theme';
import {TextInput} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomIcon from '../components/CustomIcon';
import {useDispatch} from 'react-redux';
import {publishVideo, publishVideoProps} from '../store/slices/mainReducer';
import {AppDispatch} from '../store/store';
import axios from 'axios';
import {BACKEND_URL} from '@env';
import axiosClient from '../utils/axiosClient';
import mime from 'mime';
import * as Progress from 'react-native-progress';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import {
  pendingUploadsInterface,
  setPendingUploads,
} from '../store/slices/channelSlice';
import {videoInterface} from '../interfaces/video';

type PublushVideoProps = NativeStackScreenProps<RootParamList, 'PublishVideo'>;

export default function PublishVideo({navigation, route}: PublushVideoProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setVideoUri(route.params.videoUri);
  }, [route.params.videoUri]);

  console.log(videoUri);

  const onSubmitHandler = () => {
    if (!videoUri || !title || !desc || !imageUri) {
      Alert.alert('Error!!', 'All fields are required!!');
      return;
    }
    const videoToUpload: pendingUploadsInterface = {
      videoUri,
      title,
      desc,
      imageUri,
      progress: 0,
    };
    dispatch(setPendingUploads(videoToUpload));
    navigation.navigate('Profile', {shouldUpload: true});
  };

  const publishVideoHandler = async () => {
    if (!videoUri || !title || !desc || !imageUri) {
      Alert.alert('Error!!', 'All fields are required!!');
      return;
    }
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: mime.getType(videoUri),
      name: videoUri.split('/').pop(),
    });
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('thumbnail', {
      uri: imageUri,
      type: mime.getType(imageUri),
      name: imageUri.split('/').pop(),
    });

    try {
      setIsLoading(false);
      await axiosClient.post(`/api/v1/video/publish/`, formData, {
        onUploadProgress: ({loaded, total}) => {
          console.log(Math.round((loaded * 100) / total!!));
          const progress = Math.round((loaded * 100) / total!!);
          setProgress(progress);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      // navigation.navigate('Profile');
    }

    // dispatch(publishVideo(data));
  };

  // const videoPickerHandler = async () => {
  //   try {
  //     const result = await launchImageLibrary({
  //       mediaType: 'video',
  //       selectionLimit: 1,
  //     });
  //     console.log(result);
  //     if (result.assets && result.assets[0]?.uri) {
  //       setVideoUri(result.assets[0]?.uri);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const imagePickerHandler = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });
      if (result.assets && result.assets[0]?.uri) {
        setImageUri(result.assets[0]?.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      {/* <Pressable style={styles.video} onPress={videoPickerHandler}>
        {!videoUri && <Text>Press to add video</Text>}
        {videoUri && <Text>{videoUri}</Text>}
      </Pressable> */}
      {/* <Text style={styles.title}>Thumbnail</Text> */}
      <View style={styles.thumbnail}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: imageUri
                ? imageUri
                : 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081',
            }}
            defaultSource={require('../assets/placeholder.jpeg')}
            style={styles.image}
          />
        </View>
        <Pressable style={styles.editIcon} onPress={imagePickerHandler}>
          <CustomIcon name="edit" size={20} color="white" />
        </Pressable>
      </View>
      <Text style={styles.title}>Title</Text>
      <TextInput style={styles.input} onChangeText={setTitle} />
      <Text style={styles.title}>Description</Text>
      <TextInput
        style={[styles.input, styles.descInput]}
        onChangeText={setDesc}
      />
      <Pressable style={styles.publishBtn} onPress={onSubmitHandler}>
        <Text style={styles.btnTxt}>Publish Video</Text>
      </Pressable>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Progress.Bar style={styles.progresBar} progress={progress} />
        {/* {isloading && <ActivityIndicator size={50} color={colors.text} />} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    gap: 20,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  video: {
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.text,
  },
  input: {
    padding: 8,
    backgroundColor: colors.gray,
    borderRadius: 12,
    color: colors.text,
  },
  descInput: {
    height: 150,
  },
  publishBtn: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 20,
  },
  btnTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  thumbnail: {
    overflow: 'hidden',
    borderRadius: 20,
    height: 200,
  },
  imageWrapper: {
    flex: 1,
    borderRadius: 20,
  },
  image: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  },
  editIcon: {
    borderRadius: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  progresBar: {
    width: '100%',
  },
});
