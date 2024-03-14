import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {tweetInterface} from '../../interfaces/user';
import axiosClient from '../../utils/axiosClient';

interface initialStateInterface {
  tweets: tweetInterface[] | null;
}

const initialState: initialStateInterface = {
  tweets: null,
};

export const addTweet = createAsyncThunk(
  '/tweet/add/',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.post('/api/v1/tweet/', {content: body});
      console.log(res.data.data);
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

const TweetSlice = createSlice({
  name: 'tweetReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addTweet.fulfilled, (state, action) => {
      state.tweets?.push(action.payload);
    });
    builder.addCase(deleteTweet.fulfilled, (state, action) => {
      if (state.tweets)
        state.tweets = state.tweets.filter(
          tweet => tweet._id !== action.payload.id,
        );
    });
    builder.addCase(toggleTweetLike.fulfilled, (state, action) => {
      if (state.tweets) {
        const index = state.tweets.findIndex(
          tweet => tweet._id === action.payload._id,
        );
        if (index !== -1) {
          state.tweets[index] = action.payload;
        }
      }
    });
    builder.addCase(getChannelTweets.fulfilled, (state, action) => {
      state.tweets = action.payload;
    });
  },
});

export default TweetSlice.reducer;
