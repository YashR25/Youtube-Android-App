import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import {setLoading, showToast} from './appConfigSlice';
import {videoInterface} from '../../interfaces/video';
import axios from 'axios';
import {BACKEND_URL} from '@env';

export const getAllVideos = createAsyncThunk(
  '/video/',
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get('/api/v1/video/');
      return res.data.data.docs;
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
  '/video/',
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
  videos: [videoInterface] | [];
  currentVideo: videoInterface | null;
}

const initialState: initialStateInterface = {
  videos: [],
  currentVideo: null,
};

const VideoSlice = createSlice({
  name: 'VideoSlice',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllVideos.fulfilled, (state, action) => {
      state.videos = action.payload;
      null;
    });
  },
});

export default VideoSlice.reducer;
