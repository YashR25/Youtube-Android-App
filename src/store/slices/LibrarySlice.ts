import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';
import {playlistInterface} from '../../interfaces/user';

export const getWatchHistory = createAsyncThunk(
  '/user/history/',
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get('/api/v1/user/history');
      return res.data.data.watchHistory;
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

export const getLikedVideos = createAsyncThunk(
  '/like/likedVideos',
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get('/api/v1/like/likedVideos');
      return res.data.data;
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

interface initialStateInterface {
  watchHistory: [videoInterface] | null;
  likedVideos:
    | [
        {
          _id: string;
          video: videoInterface;
        },
      ]
    | null;
}

const initialState: initialStateInterface = {
  watchHistory: null,
  likedVideos: null,
};

const LibrarySlice = createSlice({
  name: 'LibraryReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getWatchHistory.fulfilled, (state, action) => {
      state.watchHistory = action.payload;
    });
    builder.addCase(getLikedVideos.fulfilled, (state, action) => {
      state.likedVideos = action.payload;
    });
  },
});

export default LibrarySlice.reducer;
