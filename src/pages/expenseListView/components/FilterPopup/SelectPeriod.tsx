import styled from 'styled-components';
import { flexBetween, flexCenter } from '@styles/CommonStyles';

import { useFormContext } from 'react-hook-form';

import { formatYMD, convertToDateObject } from '@utils/index';

const SelectPeriod = () => {
  const { setValue, watch } = useFormContext();

  // Date 객체
  const selectedFrom = watch('from');
  const selectedTo = watch('to');

  const handleFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // date는 'yyyy-MM-dd'
    const value = event.target.value;
    setValue('from', convertToDateObject(value));
  };

  const handleToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // date는 'yyyy-MM-dd'
    const value = event.target.value;
    setValue('to', convertToDateObject(value));
  };

  return (
    <Container>
      <span className="sub-title">기간</span>
      <DateContainer>
        <DateInput defaultValue={formatYMD(selectedFrom, 'dash')} onChange={handleFromChange} />
        <span className="divide">-</span>
        <DateInput defaultValue={formatYMD(selectedTo, 'dash')} onChange={handleToChange} />
      </DateContainer>
    </Container>
  );
};

export default SelectPeriod;

const Container = styled.div`
  ${flexBetween}
  width: 100%;
`;

const DateContainer = styled.div`
  ${flexCenter}
  gap: 5px;

  & > span.divide {
    color: #9f9f9f;
  }
`;

const DateInput = styled.input.attrs({ type: 'date' })`
  width: 135px;
  height: 40px;

  padding: 10px;

  border: 1px solid #bcbcbc;
  border-radius: 6px;

  color: ${(props) => props.theme.colors.font};
  font-size: 14px;
  font-weight: 500;
`;
