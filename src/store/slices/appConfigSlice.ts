import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';
import {userInterface} from '../../interfaces/user';
import {InitialState} from '@react-navigation/native';

export const getCurrentUser = createAsyncThunk(
  '/user',
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get('/api/v1/user/current-user');
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
  isLoading: boolean;
  user: userInterface | null;
  toastData:
    | {
        type: string;
        message: string;
      }
    | {};
}

const initialState: initialStateInterface = {
  isLoading: false,
  user: null,
  toastData: {},
};

const appConfigSlice = createSlice({
  name: 'appConfigSlice',
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload.currentUser;
    });
  },
});

export default appConfigSlice.reducer;

export const {setLoading, showToast} = appConfigSlice.actions;
