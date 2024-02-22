// themes.ts

import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const colors = {
  primary: '#ff0000', // Adjust the color values as needed
  background: '#000000',
  text: '#ffffff',
  gray: '#888888',
  darkGray: '#212121',
};

export const fonts = {
  regular: width < 375 ? 14 : 16, // Adjust font sizes based on screen width
  medium: width < 375 ? 16 : 18,
  large: width < 375 ? 18 : 20,
};
