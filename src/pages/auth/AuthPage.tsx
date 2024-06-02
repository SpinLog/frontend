import { useEffect } from 'react';

import { useAuthStore } from '@stores/authStore';
import { Navigate, useSearchParams } from 'react-router-dom';

import GoSetting from '@components/information/GoSetting';
import { PagePath } from '@models/navigation';

// 서버에서 인증 받아서 돌아오는 페이지.
const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const isFirstLogin = searchParams.get('isFirstLogin');
  const access_token = searchParams.get('token');

  useEffect(() => {
    if (access_token) {
      window.localStorage.setItem('access_token', access_token);
      useAuthStore.getState().setLoginState();
    } else {
      useAuthStore.getState().setLogoutState();
    }
  }, [access_token]);

  if (!access_token) {
    return <Navigate to={`${PagePath.Login}?isLoginFail=true`} />;
  }

  if (isFirstLogin === 'true') {
    return <GoSetting />;
  }

  return <Navigate to={PagePath.Main} />;
};

export default AuthPage;
