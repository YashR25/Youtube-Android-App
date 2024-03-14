import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {userInterface} from '../../interfaces/user';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';

export const getSubscriptions = createAsyncThunk(
  '/subscription/getSubscriptions/:subscriberId',
  async (body: string, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/subscription/getSubscriptions/${body}`,
      );
      console.log('getSubscriptions', res.data.data[0].subscriptions);
      return res.data.data[0].subscriptions;
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

export const getSubscriptionVideos = createAsyncThunk(
  'channel/subscriptions/video/',
  async (body: {userId: string; page: number; limit: number}, thunkApi) => {
    console.log(body.userId);
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/video?userId=${body.userId}&page=${body.page}&limit=${body.limit}`,
      );
      console.log('getSubscriptionVideos', res.data.data);
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

export const getAllSubscriptionVideos = createAsyncThunk(
  '/subscription/getAllVideos',
  async (body, thunkApi) => {
    try {
      const res = await axiosClient.get(
        '/api/v1/subscription/getAllSubscriptionVideos/',
      );
      // console.log('getAllSubscriptionVideos', res.data.data.videos);
      return res.data.data.videos;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

interface initialStateInterface {
  subscriptions: [userInterface] | null;
  subscriptionVideos: videoInterface[] | null;
  hasNextPage: boolean;
}

const initialState: initialStateInterface = {
  subscriptions: null,
  subscriptionVideos: null,
  hasNextPage: false,
};

const SubscriptionSlice = createSlice({
  name: 'SubscriptionReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSubscriptions.fulfilled, (state, action) => {
      state.subscriptions = action.payload;
    });
    builder.addCase(getSubscriptionVideos.fulfilled, (state, action) => {
      state.hasNextPage = action.payload.hasNextPage;
      if (action.payload.page === 1) {
        state.subscriptionVideos = action.payload.docs;
        return;
      }

      const oldData = state.subscriptionVideos;
      const newData = action.payload.docs;

      if (oldData && newData) {
        state.subscriptionVideos = oldData.concat(newData);
      }
    });
    builder.addCase(getAllSubscriptionVideos.fulfilled, (state, action) => {
      // if (state.subscriptionVideos && state.subscriptionVideos.length > 0) {
      //   state.subscriptionVideos = [
      //     ...state.subscriptionVideos,
      //     action.payload,
      //   ];
      //   return;
      // }
      state.subscriptionVideos = action.payload;
    });
  },
});

export default SubscriptionSlice.reducer;
