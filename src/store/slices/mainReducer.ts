import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import {setLoading, showToast} from './appConfigSlice';
import {videoInterface} from '../../interfaces/video';
import axios from 'axios';
import {BACKEND_URL} from '@env';
import {toggleSubscription} from './videoPlaybackSlice';

export const getAllVideos = createAsyncThunk(
  '/home/video/',
  async (body: {page: number; limit: number}, thunkApi) => {
    console.log(body.page, body.limit);
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/video?page=${body.page}&limit=${body.limit}`,
      );
      console.log(res.data.data);
      return {
        page: body.page,
        data: res.data.data.docs,
        hasNextPage: res.data.data.hasNextPage,
      };
    } catch (error) {
      thunkApi.dispatch(
        showToast({
          type: '',
          message: '',
        }),
      );
      return Promise.reject(error);
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  },
);

export interface publishVideoProps {
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
}

export const publishVideo = createAsyncThunk(
  '/home/post/video/',
  async (body: publishVideoProps, thunkApi) => {
    try {
      const res = await axiosClient.post('/api/v1/video/', {
        title: body.title,
        description: body.description,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

interface initialStateInterface {
  videos: videoInterface[] | null;
  currentVideo: videoInterface | null;
  hasNextPage: boolean;
}

const initialState: initialStateInterface = {
  videos: null,
  currentVideo: null,
  hasNextPage: false,
};

const VideoSlice = createSlice({
  name: 'VideoSlice',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllVideos.fulfilled, (state, action) => {
      state.hasNextPage = action.payload.hasNextPage;
      if (action.payload.page === 1) {
        state.videos = action.payload.data;
        return;
      }
      const oldData = state.videos;
      const newData = action.payload.data;

      if (oldData && newData) {
        state.videos = oldData.concat(newData);
      }
    });
  },
});

export default VideoSlice.reducer;
