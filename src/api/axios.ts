import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    TemporaryAuth: 'OurAuthValue', // 임시 헤더
  },
});
export default axiosInstance;
