import {number, string} from 'yup';
import {userInterface} from './user';

export interface videoInterface {
  _id: string;
  createdAt: string;
  description: string;
  duration: string;
  isPublished: true;
  owner: userInterface;
  thumbnail: {publicId: string; url: string};
  title: string;
  updatedAt: string;
  videoFile: {publicId: string; url: string};
  views: number;
  isSubscribed: boolean;
}
