import styled, { css } from 'styled-components';

import { EmotionKey, EmotionKeys } from '@models/index';
import Emotion from '@components/emotion';
import { useFormContext } from 'react-hook-form';
import { flexBetween, flexCenter } from '@styles/CommonStyles';
import { getEmotionText } from '@models/emotion';
import { PrevBtn } from '@components/button';
import { useState } from 'react';

const SelectEmotion = () => {
  const { setValue, watch, getValues } = useFormContext();
  const selectedOptions = watch('emotion'); // 감정 문자열 배열

  const [isFold, setIsFold] = useState<boolean>(false);
  const handleFold = () => {
    setIsFold((prev) => !prev);
  };

  const getChekedItemMessage = () => {
    const currentValues: EmotionKey[] = getValues('emotion');

    if (currentValues.length === 0) return `0건`;
    if (currentValues.length === 1) return `${getEmotionText(currentValues[0])}`;
    return `${getEmotionText(currentValues[0])} 외 ${currentValues.length - 1}건`;
  };

  const handleCheckboxChange = (selectEmotion: EmotionKey) => {
    const value: EmotionKey = selectEmotion;

    const currentValues: EmotionKey[] = getValues('emotion');
    // 포함되어 있었다는 건, 체크 해제로 변경 / 포함되었다는건 체크로 변경한다는 뜻이라 ! 추가
    const checked: boolean = !currentValues.includes(value);

    if (checked) {
      // 체크되면 값을 배열에 추가
      setValue('emotion', [...currentValues, value]);
    } else {
      // 체크 해제되면 값을 배열에서 제거
      setValue(
        'emotion',
        currentValues.filter((item) => item !== value),
      );
    }
  };

  return (
    <Container>
      <Title style={{ display: 'flex' }}>
        <span className="sub-title">
          감정 다수 선택
          <Arrow onClick={handleFold} deg={`${isFold ? '90deg' : '270deg'}`} />
        </span>
        <span className="select">{getChekedItemMessage()}</span>
      </Title>
      {isFold && (
        <EmotionContainer>
          {EmotionKeys.map((x) => (
            <EmotionWrapper key={x}>
              <Emotion
                emotionKey={x}
                isSelect={selectedOptions.includes(x)}
                onClick={() => {
                  handleCheckboxChange(x);
                }}
                iconSize={50}
                textSize={12}
                selectSize={18}
              />
            </EmotionWrapper>
          ))}
        </EmotionContainer>
      )}
    </Container>
  );
};

export default SelectEmotion;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  gap: 30px;
`;

const EmotionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;
  width: 100%;

  gap: 30px;
`;

const EmotionWrapper = styled.div`
  ${flexCenter}
  width: 56px;
  height: 70px;
`;

const Title = styled.div`
  ${flexBetween}

  & > span.select {
    font-size: 14px;
    color: #767676;
  }
`;

const arrowStyle = css`
  width: 10px;
  height: 10px;
  color: #9f9f9f;
  stroke-width: 4;
`;

const Arrow = styled(PrevBtn)<{ deg: string }>`
  ${arrowStyle}
  transform: rotate(${(props) => props.deg});
  margin-left: 7px;
  &:hover {
    color: #9f9f9f;
    transform: rotate(${(props) => props.deg});
    stroke-width: 4;
  }
`;
