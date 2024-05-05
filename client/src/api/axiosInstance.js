import axios from 'axios';
import decodeAccessToken from '../utils/decodeAccessToken';
import { login, logout } from "../store/UserSlice";
import { store } from '../store';
import toast from "react-hot-toast";


const baseURL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  withCredentials: true, // send back initial login cookie (refreshToken cookie) to server
});


// before each request 
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    if (!response) return

    const status = response.status
    if (status === 200) return response

    // if msg obj exist then show toast msg in main request not here
    if (response.data.msg === undefined) {
      if (status === 201) toast.success(' با موفقیت ثبت شد', { position: "top-center" })

      if (status === 204) toast.success(' با موفقیت به روز رسانی شد', { position: "top-center" })

      if (status === 202) toast.error('خطا در اجرای درخواست!', { position: "top-center" })
    }

    return response;
  },
  async error => {
    if (!error) return Promise.reject(new Error('Undefined error occurred'));

    console.log(error.response);

    if (!error.response || !error.response.status) return

    const status = error.response.status;
    const msg = error.response.data;

    if (status === 408) {
      return toast.error(msg, { position: "top-center" })
      // return toast.error('درخواست بیش از حد!\n کمی بعد مجددا تلاش کنید', { position: "top-center" })
    }

    // token is not provided
    if (status === 401) {
      toast.error('مجدد وارد شوید', { position: "top-center" })
      store.dispatch(logout())
      window.location.replace('/user/login');
    }

    // If error is due to token expiration or invalid token
    if (status === 403) {

      if (msg === 'Forbidden - Invalid token') {
        const originalRequest = error.config;
        // toast.error('توکن منقضی شده است!', { position: "top-center" })

        if (!originalRequest) return Promise.reject(error);

        const newAccessToken = await refreshAccessToken();

        // Set the new access token to the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return axios(originalRequest);
      }

      if (msg === 'User role access denied') {
        return toast.error('به این قسمت دسترسی ندارید!', { position: "top-center" })
      }

    }

    if (status === 500) {
      return toast.error('خطا سرور - 500!', { position: "top-center" })
    }

    // If it's not a token-related error, return the error
    return toast.error('خطا 404', { position: "top-center" })
    // return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  try {
    const axiosWithoutInterceptor = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      withCredentials: true,
    });

    axiosWithoutInterceptor.defaults.baseURL = axiosInstance.defaults.baseURL;
    axiosWithoutInterceptor.defaults.headers.common = axiosInstance.defaults.headers.common;
    axiosWithoutInterceptor.defaults.headers.post = axiosInstance.defaults.headers.post;

    const old_isAdmin = store.getState().user.isAdmin;
    try {
      const response = await axiosWithoutInterceptor.post('/user/refreshAccessToken', {});
      if (response.status === 200) {

        const { accessToken } = response.data;

        const userInfo = decodeAccessToken(accessToken);

        store.dispatch(login({
          user: userInfo,
          isAdmin: old_isAdmin
        }));

        toast.success('توکن به روز رسانی شد', { position: "top-center" })
        return accessToken

      } else {
        console.log('Token refresh failed. Redirecting to login page...');
        store.dispatch(logout())
        if (old_isAdmin) window.location.href = '/admin/login';
        if (!old_isAdmin) window.location.href = '/user/login';
      }

    } catch (error) {
      console.error('Token refresh failed', error);
      store.dispatch(logout())
      if (old_isAdmin) window.location.href = '/admin/login';
      if (!old_isAdmin) window.location.href = '/user/login';
      return false
    }

  } catch (error) {
    console.log(error)
    throw new Error('Failed to refresh access token');
  }
}


export { axiosInstance, baseURL };