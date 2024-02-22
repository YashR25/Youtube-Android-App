import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
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
import {Provider, useDispatch} from 'react-redux';
import {getCurrentUser} from './store/slices/appConfigSlice';
import store, {AppDispatch} from './store/store';
import {videoInterface} from './interfaces/video';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PublishVideo from './screens/PublishVideo.screen';

export type RootParamList = {
  Home: undefined;
  Trending: undefined;
  Subscription: undefined;
  Library: undefined;
  BottomTabNavigation: undefined;
  Search: undefined;
  Profile: undefined;
  VideoPlayback: {
    videoId: string;
  };
  PublishVideo: undefined;
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
        initialRouteName="Home"
        screenOptions={{
          title: '',
          headerShown: false,
          tabBarStyle: {backgroundColor: colors.background, height: '10%'},
        }}>
        <BottomTab.Screen
          name="Home"
          component={Home}
          options={{
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
      <Stack.Navigator initialRouteName="BottomTabNavigation">
        <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={({navigation}) => {
            return {
              header: () => (
                <Header
                  onProfile={() => navigation.navigate('Profile')}
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
            headerTitleStyle: {color: colors.text},
          }}
        />
        <Stack.Screen
          name="VideoPlayback"
          component={VideoPlayback}
          options={{headerShown: false}}
        />
        <Stack.Screen name="PublishVideo" component={PublishVideo} />
      </Stack.Navigator>
    );
  };

  const Root = () => {
    const {authToken, setAuthToken} = useAuth();
    useEffect(() => {
      const fetchToken = async () => {
        const fetchedToken = await AsyncStorage.getItem('accessToken');
        if (fetchedToken) {
          setAuthToken(fetchedToken);
        }
      };
      fetchToken();
    }, []);
    return authToken ? <StackNavigation /> : <Auth />;
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.background}
        />
        <Provider store={store}>
          <AuthProvider>
            <Root />
          </AuthProvider>
        </Provider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});

export default App;
