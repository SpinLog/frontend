import { flexCenter, flexColumnCenter, absoluteCenter, flexBetween } from '@styles/CommonStyles';
import styled, { keyframes } from 'styled-components';
import { PrevBtn } from '@components/button';
import { useNavigate } from 'react-router-dom';

import type { Budget as BudgetType } from '@models/api/main';
import { PagePath } from '@models/navigation';

import { addCommasToNumber } from '@utils/index';

type BudgetProps = BudgetType;

const Budget = ({ monthBudget, monthSpend, monthSave }: BudgetProps) => {
  const navigate = useNavigate();

  const isBudgetZero = !monthBudget || monthBudget === 0; // budget이 없거나 0인 케이스 둘 다 예산 없는 것으로 처리.
  const remainPrice = Math.floor(monthBudget - monthSpend); // 남은 예산 (음수일 수 있음)

  // 1. 남은 예산 텍스트 : 예산이 없을 경우(= 0일 경우), 초과일 경우, 남은 경우 구분
  const remainPriceText: string = isBudgetZero
    ? '예산을 설정해주세요.'
    : remainPrice < 0
      ? `${addCommasToNumber(Math.abs(remainPrice))} 원 초과`
      : `${addCommasToNumber(remainPrice)} 원 남음`;

  // 2. 권장 지출 텍스트 : 예산이 없거나 초과일 경우, 남은 경우 구분
  // 예산 0원일 때, 초과했을 때 권장지출 다 0원
  const recommendSpend: number = isBudgetZero || remainPrice < 0 ? 0 : Math.floor(monthBudget / 30);

  // 3. 막대 그래프 퍼센트 비율 및 텍스트
  // 예산 0원일 때 그래프 : 0%, 초과일 때 100+%;
  let percent: number = 0;
  if (!isBudgetZero) percent = Math.ceil((monthSpend / monthBudget) * 100); // budget이 0원이 아닌 경우에만 계산 진행
  const percentText: string = percent > 100 ? '100+%' : `${percent}%`; // 100% 초과 시 '100+%' 로 표시

  return (
    <>
      <Remain>
        <RemainDetail>
          <span className="remain-month">한 달 예산</span>
          <span className="remain-price">{remainPriceText}</span>
          <span className="remain-recommend">
            목표 달성을 위한 하루 권장 지출 : {addCommasToNumber(recommendSpend)}원
          </span>
        </RemainDetail>
        <GoSetting>
          <SettingBtn
            onClick={() => {
              navigate(PagePath.Setting);
            }}
          />
        </GoSetting>
      </Remain>
      <Bar>
        <BarDetail $percent={`${percent}%`}>
          <span className="bar-mark"></span>
          <span className="bar-percent"></span>
          <span className="bar-text">{percentText}</span>
        </BarDetail>
      </Bar>
      <Info>
        <InfoItem>
          <span className="info-text">예산</span>
          <span className="info-price">{addCommasToNumber(monthBudget)}원</span>
        </InfoItem>
        <InfoItem>
          <span className="info-text">지출</span>
          <span className="info-price">-{addCommasToNumber(monthSpend)}원</span>
        </InfoItem>
        <InfoItem>
          <span className="info-text">절약</span>
          <span className="info-price">{addCommasToNumber(monthSave)}원</span>
        </InfoItem>
      </Info>
    </>
  );
};

export default Budget;

// 예산 영역
const Remain = styled.div`
  ${flexCenter}
  width: 100%;
  height: 30%;
  position: relative;
`;
const RemainDetail = styled.div`
  ${flexColumnCenter}
  align-items: flex-start;
  width: 100%;
  height: 100%;
  gap: 8px;

  & span.remain-month {
    color: #575755;
    font-size: 14px;
    font-weight: 400;
  }
  & span.remain-price {
    color: #333331;
    font-size: 24px;
    font-weight: 700;
  }
  & span.remain-recommend {
    color: #9f9f9f;
    font-size: 12px;
    font-weight: 400;
  }
`;

const GoSetting = styled.div`
  position: absolute;
  top: 5px;
  right: -5px;
`;

const SettingBtn = styled(PrevBtn)`
  width: 20px;
  height: 20px;
  color: #bcbcbc;
  stroke-width: 1.5;

  transform: rotate(180deg);

  &:hover {
    color: #bcbcbc;
    stroke-width: 2;
    transform: rotate(180deg);
  }
`;

// 막대 그래프 영역
const Bar = styled.div`
  ${flexColumnCenter}
  justify-content: flex-end;
  width: 100%;
  height: 20%;
  padding: 5px;

  font-size: 14px;
  color: #333331;
`;

// @keyframes를 사용하여 애니메이션 정의
const fillAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: var(--target-width); // CSS 변수를 사용
  }
`;

const BarDetail = styled.div<{ $percent: string }>`
  background-color: #e7e7e7;
  height: 25px;
  width: 100%;
  border-radius: 6px;
  position: relative;
  overflow: hidden;

  & span.bar-mark {
    ${absoluteCenter}
    border-radius: 50%;
    background-color: white;
    width: 10px;
    height: 10px;
    z-index: 1;
  }

  & span.bar-percent {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;

    background-color: ${(props) => props.theme.colors.main};
    border-radius: 0 6px 6px;

    width: 0%; // 초기 너비 설정
    --target-width: ${(props) => props.$percent}; // CSS 변수로 퍼센트 설정
    animation: ${fillAnimation} 1s ease-in-out forwards; // 애니메이션 적용
    animation-delay: 0.1s;
  }

  & span.bar-text {
    ${flexCenter}
    height:100%;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 12px;
    font-weight: 400;
    color: #767676;
  }
`;

// 예산, 지출, 절약 영역
const Info = styled.div`
  ${flexColumnCenter}
  width: 100%;
  height: 35%;
  gap: 5px;
  padding-left: 5px;
  padding-right: 5px;
`;

const InfoItem = styled.div`
  ${flexBetween}
  width: 100%;
  flex: 1;

  & span.info-text {
    font-size: 14px;
    color: #9f9f9f;
    font-weight: 300;
  }

  & span.info-price {
    color: #333331;
    font-size: 16px;
    font-weight: 700;
  }

  & span.minus {
    color: ${(props) => props.theme.colors.minus};
  }
`;
