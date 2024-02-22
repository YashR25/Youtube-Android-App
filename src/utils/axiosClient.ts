import axios from 'axios';
import {BACKEND_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  async config => {
    // Check if there is an access token in the localStorage or AsyncStorage
    const accessToken = await AsyncStorage.getItem('accessToken');

    // If access token is available, attach it to the Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  response => {
    // If the response is successful, return it
    return response;
  },
  async error => {
    // Check if the error is due to access token expiration
    if (error.response && error.response.status === 401) {
      // Perform refresh token logic here (call your refresh token API)
      // If successful, update the access token in AsyncStorage
      const newAccessToken = 'your_refreshed_access_token';
      await AsyncStorage.setItem('accessToken', newAccessToken);

      // Retry the original request with the new access token
      const originalRequest = error.config;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(originalRequest);
    }

    // If the error is not related to token expiration, return the error
    return Promise.reject(error);
  },
);

export default axiosClient;
