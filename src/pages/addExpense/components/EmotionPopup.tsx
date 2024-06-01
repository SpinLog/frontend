import { flexBetween, flexCenter, overflowWithoutScroll } from '@styles/CommonStyles';
import styled from 'styled-components';
import { CloseBtn } from '@components/button';

import { type EmotionKey, type EmotionKeyWithNone, EmotionKeys } from '@models/index';

import { useState } from 'react';

import Emotion from '@components/emotion';

type EmotionPopupProps = {
  defaultEmotion: EmotionKeyWithNone; // 빈값 허용 (감정 선택 안된 경우)
  selectEmotion: (emotion: EmotionKey) => void; // 상태 반영하며 닫기
  onClose: () => void; // 모달 그냥 닫기
};

const EmotionPopup = ({ defaultEmotion, selectEmotion, onClose }: EmotionPopupProps) => {
  // 모달 창에서의 선택 emotion 상태
  const [emotion, setEmotion] = useState<EmotionKeyWithNone>(defaultEmotion);

  // x 버튼을 누를 경우, 그냥 닫아야함.
  const handleClose = () => {
    onClose();
  };

  // 선택한 감정을 기억하고, 확인 버튼을 누를 경우에만 save
  const handleSelect = (emotion: EmotionKeyWithNone) => {
    if (!emotion) return; // 빈 값인 경우를 체크해준다. -> 디자인 나오면 button에 disable 색으로 변경 필요.
    selectEmotion(emotion);
  };

  return (
    <Container>
      <Header>
        <div>느낀 감정 1가지를 선택해주세요</div>
        <PopupCloseBtn onClick={handleClose} />
      </Header>

      <EmotionContainer>
        {EmotionKeys.map((x) => (
          <Emotion
            key={x}
            emotionKey={x}
            isSelect={x === emotion}
            onClick={() => {
              setEmotion(x);
            }}
          />
        ))}
      </EmotionContainer>
      <SelectBtn
        className={`${emotion ? '' : 'disabled'}`}
        onClick={() => {
          handleSelect(emotion);
        }}>
        완료
      </SelectBtn>
    </Container>
  );
};

export default EmotionPopup;

const Container = styled.div`
  ${overflowWithoutScroll}
  width: 370px;
  height: 670px;

  padding: 20px;

  border-radius: 20px;
  box-shadow: ${(props) => props.theme.shadows.around};

  background-color: #fff;
  overflow: hidden;
`;

const EmotionContainer = styled.div`
  ${flexCenter}
  flex-wrap: wrap;
  width: 100%;

  gap: 23px;

  margin-bottom: 20px;
`;

const Header = styled.div`
  ${flexBetween}
  align-items: flex-end;

  font-size: 20px;
  font-weight: 700;

  color: ${(props) => props.theme.colors.font};

  margin-bottom: 30px;
`;

const PopupCloseBtn = styled(CloseBtn)`
  width: 14px;
  height: 14px;
  color: #9f9f9f;
  stroke-width: 2.5;
  &:hover {
    color: #9f9f9f; // 마우스 호버 시 색상 변경
    transform: scale(1.1); // 10% 크기 증가
    stroke-width: 2.5;
  }
`;

const SelectBtn = styled.div`
  ${flexCenter}
  background-color: #47cfb0;
  width: 100%;
  height: 60px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;

  &.disabled {
    background-color: #ccc;
    color: #666;
  }
`;
