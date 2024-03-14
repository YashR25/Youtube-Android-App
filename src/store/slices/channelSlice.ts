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

export const getChannelStatsById = createAsyncThunk(
  '/dashboard/stats',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.get(`/api/v1/dashboard/user/stats/${body}`);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    } finally {
    }
  },
);

export const getChannelVideos = createAsyncThunk(
  '/dashboard/videos',
  async (body: {page: number; limit: number; userId: string}, thunkApi) => {
    try {
      const res = await axiosClient.get(
        `/api/v1/video?page=${body.page}&limit=${body.limit}&userId=${body.userId}`,
      );
      console.log('channel Videos', res.data.data.docs);
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

export const deleteVideo = createAsyncThunk(
  'video/delete/',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.delete(`/api/v1/video/${body}`);
      console.log(res.data);
      return {id: body, data: res.data.data};
    } catch (error) {}
  },
);

interface ChannelStatsInterface {
  subscribersCount: number;
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
  _id: string;
  fullName: string;
  username: string;
  avatar: string;
  coverImage: string;
}

interface initialStateInterface {
  channelStats: ChannelStatsInterface | null;
  videos: {data: videoInterface[] | null; hasNextPage: boolean};
  tweets: {data: tweetInterface[] | null; hasNextPage: boolean};
  pendingUploads: pendingUploadsInterface | null;
}

const initialState: initialStateInterface = {
  channelStats: null,
  videos: {data: null, hasNextPage: false},
  tweets: {data: null, hasNextPage: false},
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
      state.videos?.data?.push(action.payload);
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
      state.videos.hasNextPage = action.payload.hasNextPage;
      console.log(action.payload);
      if (action.payload.page === 1) {
        state.videos.data = action.payload.docs;
        return;
      }
      const oldData = state.videos.data;
      const newData = action.payload.docs;

      if (oldData && newData) {
        state.videos.data = oldData.concat(newData);
      }
    });
    builder.addCase(getChannelTweets.fulfilled, (state, action) => {
      state.tweets = action.payload;
    });
    builder.addCase(togglePublishStatus.fulfilled, (state, action) => {
      const fetchedVideo = action.payload as videoInterface;
      if (state.videos.data) {
        const index = state.videos.data?.findIndex(
          video => video._id === fetchedVideo._id,
        );
        if (index != -1) state.videos.data[index] = action.payload;
      }
    });
    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      if (state.tweets.data) {
        const index = state.tweets.data?.findIndex(
          tweet => tweet._id === action.payload.tweetId,
        );
        if (index) state.tweets.data[index].isLiked = action.payload.isLiked;
      }
    });
    builder.addCase(deleteTweet.fulfilled, (state, action) => {
      if (state.tweets.data) {
        state.tweets.data = state.tweets.data.filter(tweet => {
          return tweet._id !== action.payload.id;
        });
      }
    });
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      if (state.videos.data) {
        state.videos.data = state.videos.data.filter(video => {
          return video._id !== action.payload?.id;
        });
      }
    });
  },
});

export default ChannelSlice.reducer;
export const {setPendingUploads, addToVideos, setUploadingProgress} =
  ChannelSlice.actions;
