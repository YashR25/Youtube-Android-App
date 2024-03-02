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
      console.log(res.data.data);
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

export const getSubscriptionVideos = createAsyncThunk(
  '/subscriptions/video/',
  async (body: string, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(`/api/v1/video?userId=${body}`);
      console.log(res.data.data);
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

interface initialStateInterface {
  subscriptions: [userInterface] | null;
  subscriptionVideos: [videoInterface] | null;
}

const initialState: initialStateInterface = {
  subscriptions: null,
  subscriptionVideos: null,
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
      state.subscriptionVideos = action.payload;
    });
  },
});

export default SubscriptionSlice.reducer;
