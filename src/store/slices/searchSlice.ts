import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {videoInterface} from '../../interfaces/video';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';

interface paramsInterface {
  query: string;
}

export const searchVideos = createAsyncThunk(
  '/search/video/',
  async (body: paramsInterface, thunkAPi) => {
    try {
      thunkAPi.dispatch(setLoading(true));
      const res = await axiosClient.get(`/api/v1/video?query=${body.query}`);
      return res.data.data.docs;
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
  resultVideos: [videoInterface] | null;
}

const initialState: initialStateInterface = {
  resultVideos: null,
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
      state.resultVideos = action.payload;
    });
  },
});

export default SearchSlice.reducer;
export const {setResultVideos} = SearchSlice.actions;
