import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import RoundedImage from '../components/RoundedImage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TopTabVideos from '../components/TopTab/TopTabVideos';
import TopTabTweets from '../components/TopTab/TopTabTweets';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store/store';
import {getChannelStats} from '../store/slices/channelSlice';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootParamList} from '../App';
import FloatingButton from '../components/comment/FloatingButton';
import {colors} from '../utils/theme';

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

  useEffect(() => {
    dispach(getChannelStats());
  }, []);

  if (!channelStats) {
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size={50} color={colors.text} />
    </View>;
  }

  return (
    <View style={styles.container}>
      <FloatingButton
        onPress={() => {
          navigation.navigate('PublishVideo');
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
        initialRouteName="Videos"
        style={{flex: 1}}
        screenOptions={{
          tabBarStyle: {backgroundColor: colors.background},
          tabBarLabelStyle: {color: colors.text},
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
