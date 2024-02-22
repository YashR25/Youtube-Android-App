import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';
import {videoInterface} from '../../interfaces/video';
import {commentInterface} from '../../interfaces/user';

export const getVideoById = createAsyncThunk(
  '/video/:videoId',
  async (body: string, thunkAPi) => {
    try {
      thunkAPi.dispatch(setLoading(true));
      const res = await axiosClient.get(`/api/v1/video/${body}`);
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

export const getVideoComments = createAsyncThunk(
  '/comment/video/:videoId',
  async (body: string, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const res = await axiosClient.get(`/api/v1/comment/video/${body}`);
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

export interface addVideoCommentProps {
  videoID: string;
  comment: string;
}

export const addVideoComment = createAsyncThunk(
  '/comment/:videoID',
  async (body: addVideoCommentProps, thunkApi) => {
    try {
      const res = await axiosClient.post(`/api/v1/comment/${body.videoID}`, {
        comment: body.comment,
      });
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const toggleLike = createAsyncThunk(
  '/like/video/:videoId',
  async (body: string, thunkAPi) => {
    try {
      const res = await axiosClient.patch(`/api/v1/like/video/${body}`);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

interface initialStateInterface {
  video: videoInterface | null;
  comments: [commentInterface] | null;
  isLiked: boolean;
}

const initialState: initialStateInterface = {
  video: null,
  comments: null,
  isLiked: false,
};

const VideoPlaybackSlice = createSlice({
  name: 'VideoReducer',
  initialState: initialState,
  reducers: {
    setCurrentVideo: (state, action) => {
      state.video = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(getVideoById.fulfilled, (state, action) => {
      state.video = action.payload;
      state.isLiked = action.payload.isLiked;
    });
    builder.addCase(getVideoComments.fulfilled, (state, action) => {
      state.comments = action.payload;
    });
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      state.isLiked = action.payload.isLiked;
    });
    builder.addCase(addVideoComment.fulfilled, (state, action) => {
      const comment = action.payload as commentInterface;
      state.comments?.push(comment);
    });
  },
});

export default VideoPlaybackSlice.reducer;
export const {setCurrentVideo} = VideoPlaybackSlice.actions;
