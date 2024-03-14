import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {setLoading, showToast} from './appConfigSlice';
import axiosClient from '../../utils/axiosClient';
import {videoInterface} from '../../interfaces/video';
import {commentInterface} from '../../interfaces/user';
import {getAllVideos} from './mainReducer';

export const toggleCommentLike = createAsyncThunk(
  '/comment/like',
  async (body: string, thunkAPi) => {
    try {
      const res = await axiosClient.patch(`/api/v1/like/comment/${body}`);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

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
      console.log('comment added res', res.data.data);
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

export const toggleSubscription = createAsyncThunk(
  '/toggleSubscription/:channelId',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.get(
        `/api/v1/subscription/toggleSubscription/${body}`,
      );
      thunkApi.dispatch(getAllVideos({page: 1, limit: 10}));
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const deleteComment = createAsyncThunk(
  'comment/delete/',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.delete(`/api/v1/comment/${body}`);
      console.log(res.data.data);
      return {id: body, data: res.data.data};
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const updateComment = createAsyncThunk(
  'comment/update',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.patch(`/api/v1/comment/${body}`);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export interface CurrentPlayingVideoInterface {
  isPlaylist: boolean;
  playlistId: string | null;
  videoId: string | null;
}

interface initialStateInterface {
  currentPlayingVideo: CurrentPlayingVideoInterface | null;
  video: videoInterface | null;
  comments: commentInterface[] | null;
  isLiked: boolean;
}

const initialState: initialStateInterface = {
  currentPlayingVideo: null,
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
    setCurrentPlayingVideo: (state, action) => {
      state.currentPlayingVideo = action.payload;
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
    builder.addCase(toggleSubscription.fulfilled, (state, action) => {
      if (state.video) {
        state.video.isSubscribed = action.payload.isSubscribed;
      }
    });
    builder.addCase(toggleCommentLike.fulfilled, (state, action) => {
      if (state.comments) {
        const index = state.comments.findIndex(
          comment => comment._id === action.payload.id,
        );
        if (index !== -1) {
          state.comments[index].isLiked = action.payload.isLiked;
        }
      }
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      if (state.comments) {
        state.comments = state.comments.filter(comment => {
          return comment._id !== action.payload.id;
        });
      }
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      if (state.comments) {
        const index = state.comments.findIndex(comment => {
          return comment._id === action.payload._id;
        });
        state.comments[index] = action.payload;
      }
    });
  },
});

export default VideoPlaybackSlice.reducer;
export const {setCurrentVideo, setCurrentPlayingVideo} =
  VideoPlaybackSlice.actions;
