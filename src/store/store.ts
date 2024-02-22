import {configureStore} from '@reduxjs/toolkit';
import appConfigSlice from './slices/appConfigSlice';
import VideoSlice from './slices/mainReducer';
import VideoPlaybackSlice from './slices/videoPlaybackSlice';
import searchSlice from './slices/searchSlice';
import trendingSlice from './slices/trendingSlice';
import subscriptionSlice from './slices/subscriptionSlice';
import LibrarySlice from './slices/LibrarySlice';
import ChannelSlice from './slices/channelSlice';

const store = configureStore({
  reducer: {
    appConfigReducer: appConfigSlice,
    mainReducer: VideoSlice,
    videoReducer: VideoPlaybackSlice,
    searchReducer: searchSlice,
    trendingReducer: trendingSlice,
    subsciptionReducer: subscriptionSlice,
    LibraryReducer: LibrarySlice,
    channelReducer: ChannelSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
