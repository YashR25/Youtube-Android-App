import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';

export const getTrendingVideos = createAsyncThunk(
  '/trending/video/',
  async (body: {page: number; limit: number}, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/video?sortBy=views&sortType=desc&page=${body.page}&limit=${body.limit}`,
      );
      console.log('getTrendingVideos', res.data.data);
      return res.data.data;
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
  trendingData: videoInterface[] | null;
  hasNextPage: boolean;
}

const initialState: InitialStateInterface = {
  trendingData: null,
  hasNextPage: false,
};

const TrendingSlice = createSlice({
  name: 'TrendingReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTrendingVideos.fulfilled, (state, action) => {
      state.hasNextPage = action.payload.hasNextPage;
      if (state.trendingData && state.trendingData.length > 0) {
        console.log(action.payload.docs.length);
        state.trendingData = [...state.trendingData, ...action.payload.docs];
        return;
      }
      state.trendingData = action.payload.docs;
    });
  },
});

export default TrendingSlice.reducer;
