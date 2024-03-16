import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';
import {playlistInterface} from '../../interfaces/user';

export const getWatchHistory = createAsyncThunk(
  '/user/history/',
  async (body: {page: number; limit: number}, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/user/history?page=${body.page}&limit=${body.limit}`,
      );
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

export const getLikedVideos = createAsyncThunk(
  '/like/likedVideos',
  async (body: {page: number; limit: number}, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/like/likedVideos?page=${body.page}&limit=${body.limit}`,
      );
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
  watchHistory: {data: videoInterface[] | null; hasNextPage: boolean};
  likedVideos: {
    data:
      | {
          _id: string;
          video: videoInterface;
        }[]
      | null;
    hasNextPage: boolean;
  };
}

const initialState: initialStateInterface = {
  watchHistory: {data: null, hasNextPage: false},
  likedVideos: {data: null, hasNextPage: false},
};

const LibrarySlice = createSlice({
  name: 'LibraryReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getWatchHistory.fulfilled, (state, action) => {
      state.watchHistory.hasNextPage = action.payload.hasNextPage;
      if (Number(action.payload.page) === 1) {
        state.watchHistory.data = action.payload.docs;
        return;
      }

      const oldData = state.watchHistory.data;
      const newData = action.payload.docs;

      if (oldData && newData) {
        state.watchHistory.data = oldData.concat(newData);
      }
    });
    builder.addCase(getLikedVideos.fulfilled, (state, action) => {
      state.likedVideos.hasNextPage = action.payload.hasNextPage;

      if (Number(action.payload.page) === 1) {
        state.likedVideos.data = action.payload.docs;
        return;
      }

      const oldData = state.likedVideos.data;
      const newData = action.payload.docs;

      if (oldData && newData) {
        state.likedVideos.data = oldData.concat(newData);
      }
    });
  },
});

export default LibrarySlice.reducer;
