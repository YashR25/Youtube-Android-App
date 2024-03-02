import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {tweetInterface, userInterface} from '../../interfaces/user';
import {videoInterface} from '../../interfaces/video';
import axiosClient from '../../utils/axiosClient';

export const getChannelStats = createAsyncThunk(
  '/dashboard/stats',
  async (body, thunkApi) => {
    try {
      const res = await axiosClient.get('/api/v1/dashboard/stats');
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

export const deleteTweet = createAsyncThunk(
  '/tweet/delete/',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.delete(`/api/v1/tweet/${body}`);
      console.log(res.data.data);
      return {id: body, data: res.data.data};
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
  videos: [videoInterface] | null;
  tweets: tweetInterface[] | null;
  pendingUploads: pendingUploadsInterface | null;
}

const initialState: initialStateInterface = {
  channelStats: null,
  videos: null,
  tweets: null,
  pendingUploads: null,
};

export interface pendingUploadsInterface {
  videoUri: string;
  title: string;
  desc: string;
  imageUri: string;
  progress: number;
}

const ChannelSlice = createSlice({
  name: 'channelReducer',
  initialState: initialState,
  reducers: {
    setPendingUploads: (state, action) => {
      state.pendingUploads = action.payload;
    },
    addToVideos: (state, action) => {
      state.videos?.push(action.payload);
    },
    setUploadingProgress: (state, action) => {
      if (state.pendingUploads) {
        state.pendingUploads.progress = action.payload;
      }
    },
  },
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
      if (state.videos) {
        const index = state.videos?.findIndex(
          video => video._id === fetchedVideo._id,
        );
        if (index != -1) state.videos[index] = action.payload;
      }
    });
    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      if (state.tweets) {
        const index = state.tweets.findIndex(
          tweet => tweet._id === action.payload.tweetId,
        );
        if (index) state.tweets[index].isLiked = action.payload.isLiked;
      }
    });
    builder.addCase(deleteTweet.fulfilled, (state, action) => {
      if (state.tweets) {
        state.tweets = state.tweets.filter(tweet => {
          return tweet._id !== action.payload.id;
        });
      }
    });
  },
});

export default ChannelSlice.reducer;
export const {setPendingUploads, addToVideos, setUploadingProgress} =
  ChannelSlice.actions;
