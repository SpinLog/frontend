import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    TemporaryAuth: 'OurAuthValue',
  },
});
export default axiosInstance;
