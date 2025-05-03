import LoginBird from '@assets/images/bird/loginBird.svg?react';
import FixedWidthImage from '@components/image/FixedWidthImage';
import { PagePath } from '@models/navigation';
import { useAuthStore } from '@stores/authStore';
import { flexColumnCenter } from '@styles/CommonStyles';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

const LoginButtonContainer = () => {
  const AUTH_URL = `${import.meta.env.VITE_API_URL}/users/login`;

  const navigate = useNavigate();
  const { setDemoState } = useAuthStore((state) => {
    return {
      setDemoState: state.setDemoState,
    };
  });

  // 이벤트 핸들러는 JSX를 반환하지 않기 때문에 useNavigate로 페이지 이동 필요
  // 데모 로그인 처리
  const handleClickDemo = () => {
    setDemoState();
    navigate(PagePath.Main);
  };
  return (
    <Container>
      <Button href={`${AUTH_URL}/kakao`}>
        <Bird />
        <FixedWidthImage
          src="/assets/login/kakao.avif"
          width={358}
          height={60}
          alt="카카오 로그인"
        />
      </Button>
      <Button href={`${AUTH_URL}/naver`}>
        <FixedWidthImage
          src="/assets/login/naver.avif"
          width={358}
          height={60}
          alt="네이버 로그인"
        />
      </Button>
      <Button href={`${AUTH_URL}/google`}>
        <FixedWidthImage
          src="/assets/login/google.avif"
          width={358}
          height={60}
          alt="구글 로그인"
        />
      </Button>
      <ExperienceButton onClick={handleClickDemo}>체험하기</ExperienceButton>
    </Container>
  );
};

export default LoginButtonContainer;

const Container = styled.div`
  ${flexColumnCenter}
  position: relative;
  width: 100%;
  height: 40%;
  gap: 12px;
`;

const Button = styled.a`
  width: 358px;
  height: 60px;
  overflow: hidden;
  z-index: 1;
  cursor: pointer;
  border-radius: 6px;
  box-shadow: ${(props) => props.theme.shadows.around};
`;

const Bird = styled(LoginBird)`
  position: absolute;
  top: -55px;
  right: 0px;
  z-index: -1;
`;

const ExperienceButton = styled.button`
  width: 358px;
  height: 50px;
  margin-top: 10px;

  border-radius: 6px;
  background-color: ${(props) => props.theme.colors.lightGreen};

  color: white;
  font-size: 18px;
  font-weight: 500;
`;
