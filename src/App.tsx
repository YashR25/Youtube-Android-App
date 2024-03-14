import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import Search from './screens/Search.screen';
import Profile from './screens/ProfileScreen.screen';
import Home from './screens/Home.screen';
import Trending from './screens/Trending.screen';
import Subscription from './screens/Subscription.screen';
import Library from './screens/Library.screen';
import Icons from './components/BottomTabIcon';
import Header from './components/header/Header';
import SearchHeader from './components/header/SearchHeader';
import VideoPlayback from './screens/VideoPlayback.screen';
import {BACKEND_URL} from '@env';
import axios from 'axios';
import Auth from './screens/auth/Auth.screen';
import {AuthProvider, useAuth} from './context/AuthContext';
import {colors} from './utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {getCurrentUser} from './store/slices/appConfigSlice';
import store, {AppDispatch, RootState} from './store/store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PublishVideo from './screens/PublishVideo.screen';
import {SocketProvider} from './context/SocketContext';
import PlaylistDetail from './screens/PlaylistDetail.screen';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Provider as PaperProvider} from 'react-native-paper';
import {videoInterface} from './interfaces/video';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import CustomBottomtab from './components/CustomBottomTab/CustomBottomtab';
import BottomPlayer from './components/CustomBottomTab/BottomPlayer';
import TabWithPlayer from './components/CustomBottomTab/TabWithPlayer';
import BootSplash from 'react-native-bootsplash';

export type RootParamList = {
  HomeStack: undefined;
  Trending: undefined;
  Subscription: undefined;
  Library: undefined;
  Home: undefined;
  Search: undefined;
  Profile: {
    shouldUpload: boolean;
    userId: string;
  };
  VideoPlayback: {
    videoId: string;
  };
  PublishVideo: {
    videoUri: string;
  };
  PlaylistDetail: {
    playlistId: string;
  };
  VideoPlayerScreen: {
    videoId: string | null;
    playlistId: string | null;
  };
};

const Stack = createNativeStackNavigator<RootParamList>();
const BottomTab = createBottomTabNavigator<RootParamList>();

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const BottomTabNavigation = () => {
    return (
      <BottomTab.Navigator
        initialRouteName="HomeStack"
        tabBar={props => <TabWithPlayer {...props} />}
        screenOptions={({navigation}) => {
          return {
            header: () => (
              <Header
                onProfile={() =>
                  navigation.navigate('Profile', {
                    shouldUpload: false,
                  })
                }
                onSearch={() => navigation.navigate('Search')}
              />
            ),
            title: '',
            // headerShown: false,
            tabBarStyle: {backgroundColor: colors.background, height: '10%'},
          };
        }}>
        <BottomTab.Screen
          name="HomeStack"
          component={StackNavigation}
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <Icons
                name="home"
                size={20}
                color={colors.text}
                focused={focused}
                title="Home"
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Trending"
          component={Trending}
          options={{
            title: 'Trending',
            tabBarIcon: ({focused}) => (
              <Icons
                name="linechart"
                size={20}
                color={colors.text}
                focused={focused}
                title="Trending"
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Subscription"
          component={Subscription}
          options={{
            title: 'Subscription',
            tabBarIcon: ({focused}) => (
              <Icons
                name="youtube"
                size={20}
                color={colors.text}
                focused={focused}
                title="Subscription"
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Library"
          component={Library}
          options={{
            title: 'Library',
            tabBarIcon: ({focused}) => (
              <Icons
                name="folder1"
                size={20}
                color={colors.text}
                focused={focused}
                title="Library"
              />
            ),
          }}
        />
      </BottomTab.Navigator>
    );
  };

  const StackNavigation = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
      dispatch(getCurrentUser());
    }, [dispatch]);
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={({navigation}) => {
            return {
              header: () => (
                <Header
                  onProfile={() =>
                    navigation.navigate('Profile', {shouldUpload: false})
                  }
                  onSearch={() => navigation.navigate('Search')}
                />
              ),
            };
          }}
        />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShadowVisible: false,
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="VideoPlayback"
          component={VideoPlayback}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PublishVideo"
          component={PublishVideo}
          options={{
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="PlaylistDetail"
          component={PlaylistDetail}
          options={{
            headerStyle: {backgroundColor: colors.background},
            headerTintColor: colors.text,
          }}
        />
        <Stack.Screen
          name="VideoPlayerScreen"
          component={VideoPlayerScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  const Root = () => {
    const {authToken, setAuthToken} = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
      const fetchToken = async () => {
        setIsLoading(true);
        const fetchedToken = await AsyncStorage.getItem('accessToken');
        if (fetchedToken) {
          setAuthToken(fetchedToken);
        }
        setIsLoading(false);
        BootSplash.hide();
      };
      fetchToken();
    }, []);

    if (isLoading) {
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

    return authToken ? (
      <SocketProvider>
        {/* <StackNavigation /> */}
        <BottomTabNavigation />
      </SocketProvider>
    ) : (
      <Auth />
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        onReady={() => {
          // BootSplash.hide();
        }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.background}
        />
        <Provider store={store}>
          <AuthProvider>
            <BottomSheetModalProvider>
              <PaperProvider>
                {/* <BottomPlayer /> */}
                <Root />
              </PaperProvider>
            </BottomSheetModalProvider>
          </AuthProvider>
        </Provider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});

export default App;
