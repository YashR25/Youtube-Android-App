import {videoInterface} from './video';

export interface userInterface {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  watchHistory: [videoInterface];
  createdAt: string;
  updatedAt: string;
  isSubscribed: boolean;
}

export interface commentInterface {
  _id: string;
  content: string;
  owner: userInterface;
  video: videoInterface;
  createdAt: string;
  updatedAt: string;
}

export interface tweetInterface {
  _id: string;
  content: string;
  owner: userInterface;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
}
