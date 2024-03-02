import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {playlistInterface} from '../../interfaces/user';
import axiosClient from '../../utils/axiosClient';

interface initialStateInterface {
  playlists: playlistInterface[] | null;
  currentPlaylist: playlistInterface | null;
}

const initialState: initialStateInterface = {
  playlists: null,
  currentPlaylist: null,
};

interface addVideoToPlaylistBodyProps {
  playlistId: string;
  videoId: string;
}

export const addVideoToPlaylist = createAsyncThunk(
  '/playlist/video',
  async ({playlistId, videoId}: addVideoToPlaylistBodyProps, thunkApi) => {
    try {
      const res = await axiosClient.post(
        `/api/v1/playlist/video/${playlistId}/${videoId}`,
      );
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const getAllPlaylists = createAsyncThunk(
  '/library/playlist/all',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.get(`/api/v1/playlist/user/${body}`);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const deletePlaylist = createAsyncThunk(
  '/playlist/delete',
  async (body: string, thunkApi) => {
    try {
      const res = await axiosClient.delete(`/api/v1/playlist/${body}`);
      console.log(res.data.data);
      return {id: body, data: res.data.data};
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const deleteVideoFromPlaylist = createAsyncThunk(
  '/playlist/video/delete',
  async (body: addVideoToPlaylistBodyProps, thunkApi) => {
    try {
      const res = await axiosClient.delete(
        `/api/v1/playlist/video/${body.playlistId}/${body.videoId}`,
      );
      console.log(res.data.data);
      return {videoId: body.videoId, data: res.data.data};
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const getPlaylistDetails = createAsyncThunk(
  '/playlist/details/',
  async (body: string, thunkAPi) => {
    try {
      const res = await axiosClient.get(`/api/v1/playlist/${body}`);
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export const createPlaylist = createAsyncThunk(
  '/playlist/create/',
  async (body: {name: string; description: string}, thunkApi) => {
    try {
      const res = await axiosClient.post('/api/v1/playlist/', {
        name: body.name,
        description: body.description,
      });
      console.log(res.data.data);
      return res.data.data;
    } catch (error) {}
  },
);

const PlaylistSlice = createSlice({
  name: 'playlistReducer',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllPlaylists.fulfilled, (state, action) => {
      if (state.playlists) {
        state.playlists = action.payload;
      }
    });
    builder.addCase(deletePlaylist.fulfilled, (state, action) => {
      if (state.playlists)
        state.playlists = state.playlists?.filter(playlist => {
          return playlist._id !== action.payload.id;
        });
    });
    builder.addCase(deleteVideoFromPlaylist.fulfilled, (state, action) => {
      if (state.currentPlaylist)
        state.currentPlaylist.videos = state.currentPlaylist?.videos.filter(
          video => {
            video._id !== action.payload.videoId;
          },
        );
    });
    builder.addCase(getPlaylistDetails.fulfilled, (state, action) => {
      state.currentPlaylist = action.payload;
    });
    builder.addCase(createPlaylist.fulfilled, (state, action) => {
      state.playlists?.push(action.payload);
    });
  },
});

export default PlaylistSlice.reducer;
