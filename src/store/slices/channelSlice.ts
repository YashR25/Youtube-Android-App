import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {tweetInterface, userInterface} from '../../interfaces/user';
import {videoInterface} from '../../interfaces/video';
import axiosClient from '../../utils/axiosClient';

export const getChannelStats = createAsyncThunk(
  '/dashboard/stats',
  async (body, thunkApi) => {
    try {
      const res = await axiosClient.get('/api/v1/dashboard/stats');
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
    }
  },
);

export const getChannelVideos = createAsyncThunk(
  '/dashboard/videos',
  async (body, thunkApi) => {
    try {
      const res = await axiosClient.get('/api/v1/dashboard/videos');
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
    }
  },
);

export const getChannelTweets = createAsyncThunk(
  '/tweet/c/:channelId',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.get(`/api/v1/tweet/c/${body}`);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const togglePublishStatus = createAsyncThunk(
  '/video/toggle/publish/:videoId',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.patch(
        `/api/v1/video/toggle/publish/${body}`,
      );
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const toggleTweetLike = createAsyncThunk(
  '/like/tweet/:tweetId',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.patch(`/api/v1/like/tweet/${body}`);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

interface ChannelStatsInterface {
  subscribersCount: number;
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
}

interface initialStateInterface {
  channelStats: ChannelStatsInterface | null;
  videos: [videoInterface] | [];
  tweets: [tweetInterface] | [];
}

const initialState: initialStateInterface = {
  channelStats: null,
  videos: [],
  tweets: [],
};

const ChannelSlice = createSlice({
  name: 'channelReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getChannelStats.fulfilled, (state, action) => {
      state.channelStats = action.payload;
    });
    builder.addCase(getChannelVideos.fulfilled, (state, action) => {
      state.videos = action.payload;
    });
    builder.addCase(getChannelTweets.fulfilled, (state, action) => {
      state.tweets = action.payload;
    });
    builder.addCase(togglePublishStatus.fulfilled, (state, action) => {
      const fetchedVideo = action.payload as videoInterface;
      const index = state.videos.findIndex(
        video => video._id === fetchedVideo._id,
      );
      state.videos[index] = action.payload;
    });
    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      const index = state.tweets.findIndex(
        tweet => tweet._id === action.payload.tweetId,
      );
      state.tweets[index].isLiked = action.payload.isLiked;
    });
  },
});

export default ChannelSlice.reducer;
