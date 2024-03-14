import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';

interface paramsInterface {
  query: string;
  page: number;
  limit: number;
}

export const searchVideos = createAsyncThunk(
  '/search/video/',
  async (body: paramsInterface, thunkAPi) => {
    try {
      thunkAPi.dispatch(setLoading(true));
      const res = await axiosClient.get(
        `/api/v1/video?query=${body.query}&page=${body.page}&limit=${body.limit}`,
      );
      return res.data.data;
    } catch (error) {
      thunkAPi.dispatch(
        showToast({
          type: '',
          message: '',
        }),
      );
      return Promise.reject(error);
    } finally {
      thunkAPi.dispatch(setLoading(false));
    }
  },
);

interface initialStateInterface {
  resultVideos: videoInterface[] | null;
  hasNextPage: boolean;
}

const initialState: initialStateInterface = {
  resultVideos: null,
  hasNextPage: false,
};

const SearchSlice = createSlice({
  name: 'SearchReducer',
  initialState: initialState,
  reducers: {
    setResultVideos: (state, action) => {
      state.resultVideos = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(searchVideos.fulfilled, (state, action) => {
      state.hasNextPage = action.payload.hasNextPage;
      if (action.payload.page === 1) {
        state.resultVideos = action.payload.docs;
        return;
      }
      const oldData = state.resultVideos;
      const newData = action.payload.docs;

      if (oldData && newData) {
        state.resultVideos = oldData.concat(newData);
      }
    });
  },
});

export default SearchSlice.reducer;
export const {setResultVideos} = SearchSlice.actions;
