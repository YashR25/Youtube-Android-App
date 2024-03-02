import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';

export const getTrendingVideos = createAsyncThunk(
  '/trending/video/',
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/video?sortBy=views&sortType=desc`,
      );
      return res.data.data.docs;
    } catch (error) {
      thunkApi.dispatch(
        showToast({
          type: '',
          message: '',
        }),
      );
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  },
);

interface InitialStateInterface {
  trendingData: [videoInterface] | [];
}

const initialState: InitialStateInterface = {
  trendingData: [],
};

const TrendingSlice = createSlice({
  name: 'TrendingReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTrendingVideos.fulfilled, (state, action) => {
      state.trendingData = action.payload;
    });
  },
});

export default TrendingSlice.reducer;
