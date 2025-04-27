import { useAuthStore } from '@stores/authStore';
import { ACCESS_TOKEN_NAME } from '@stores/storeConfig';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://www.api-spinlog.shop2/api',
  headers: {
    'Content-Type': 'application/json',
    //TemporaryAuth: 'OurAuthValue', // 임시 헤더 -> 로컬 요청 처리
  },
  withCredentials: true,
});

// Demo Mode 개발로 주석처리
// 개발 모드일 때만 TemporaryAuth 헤더를 추가(테스트 계정으로 자동 로그인)
if (import.meta.env.MODE === 'development') {
  axiosInstance.defaults.headers.common['TemporaryAuth'] = 'OurAuthValue';
}

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_NAME);
    if (accessToken) {
      config.headers['Authorization'] = `${accessToken}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response) => {
    // 요청이 성공적으로 완료되면 응답 반환
    return response;
  },
  (error) => {
    // 401 오류가 발생했을 때의 처리 : 인증되지 않은 사용자의 요청
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().setLogoutState();

      // 상태 업데이트를 보장하기 위해 setTimeout 사용
      setTimeout(() => {
        window.location.href = '/login';
        console.log('인증이 만료되어 로그아웃되었습니다.');
      }, 0);
    }
    // 이외의 오류는 다시 throw 하여 호출자에게 전달
    return Promise.reject(error);
  },
);

export default axiosInstance;
