import { useAuthStore } from '@stores/authStore';
import { Navigate, useSearchParams } from 'react-router-dom';

import GoSetting from '@components/information/GoSetting';
import { PagePath } from '@models/navigation';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const isFirstLogin = searchParams.get('isFirstLogin');
  const access_token = searchParams.get('token');

  // 서버에서 인증 받아서 돌아오는 페이지.
  // 정상적으로 redirect 되었으면 로그인 상태로 업데이트 시켜준다.
  if (access_token) {
    window.localStorage.setItem('access_token', access_token);
    useAuthStore.getState().setLoginState();

    // 최초 로그인일 경우 환경설정 유도 페이지로 이동
    if (isFirstLogin === 'true') return <GoSetting />;
    return <Navigate to={PagePath.Main} />;
  } else {
    // 토큰이 없다면 로그인 실패
    useAuthStore.getState().setLogoutState();
    return <Navigate to={`${PagePath.Login}?isLoginFail=true`} />;
  }
};

export default AuthPage;
