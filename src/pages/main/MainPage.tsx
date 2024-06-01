import styled from 'styled-components';
import { flexColumnBetween, mainSection, overflowWithoutScroll } from '@styles/CommonStyles';

import TopNavigation from '@layout/TopNavigation';
import BottomNavigation from '@layout/BottomNavigation';
import Spinner from '@components/information/Spinner';
import Background from '@components/background';
import MetaThemeColor from '@components/background/MetaThemeColor';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMainData from './hooks/useMainData';

import useMonthNavigator from '@hooks/useMonthNavigator';
import MonthNavigatorBtn from '@components/date/MonthNavigatorBtn';

import Budget from './components/Budget';
import DayExpenseListTop2 from './components/DayExpenseTop2';
import Calendar from './components/Calendar';

type MainNavProps = {
  currentDate: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  children: React.ReactNode;
};

const NavigationLayout = ({ children, currentDate, previousMonth, nextMonth }: MainNavProps) => {
  const navigate = useNavigate();
  const mainColor = { color: 'white' };
  const monthNavProps = { currentDate, previousMonth, nextMonth, ...mainColor };

  const [showBackground, setShowBackground] = useState<boolean>(false);

  useEffect(() => {
    setShowBackground(true);
    return () => {
      setShowBackground(false);
    };
  }, []);
  return (
    <>
      <MetaThemeColor color="#47CFB0" />
      <TopNavigation
        _TopBar={
          <TopNavigation.TopBar
            leftContent={<TopNavigation.TopBar.LogoWhiteButton />}
            rightContent={
              <TopNavigation.TopBar.SettingGreenButton
                style={mainColor}
                onClick={() => {
                  navigate('/setting');
                }}
              />
            }
          />
        }
        _Extension={
          <MonthNavWrapper>
            <MonthNavigatorBtn {...monthNavProps} />
          </MonthNavWrapper>
        }
      />
      {children}
      <BottomNavigation location="main" />
      {showBackground && <Background height="36%" color="#47CFB0" />}
    </>
  );
};

const MonthNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 40px;
`;

const MainPage = () => {
  // monthNav.currentDate : 현재 선택된 월
  const monthNav = useMonthNavigator(); // 헤더의 월 네비게이션
  const { mainData, isLoadingMainData, mainDataError, subData, isLoadingSubData, subDataError } =
    useMainData(monthNav.currentDate);

  return (
    <>
      <NavigationLayout {...monthNav}>
        <MainContainer>
          <BudgetContainer $isLoading={isLoadingMainData}>
            {isLoadingMainData ? (
              <Spinner />
            ) : mainDataError ? (
              <div>An error occurred</div>
            ) : !mainData.data.budget ? (
              <div>예산 데이터 없음</div>
            ) : (
              <Budget {...mainData.data.budget} />
            )}
          </BudgetContainer>
          <CalendarWrapper>
            {isLoadingMainData ? (
              <Spinner />
            ) : mainDataError ? (
              <div>An error occurred</div>
            ) : !mainData.data.monthSpendList ? (
              <div>소비 데이터 없음</div>
            ) : (
              <Calendar {...monthNav} data={mainData.data.monthSpendList} />
            )}
          </CalendarWrapper>
          <DayListContainer>
            {isLoadingSubData ? (
              <Spinner />
            ) : subDataError ? (
              <div>An error occurred</div>
            ) : !subData.data.daySpendList ? (
              <div>리스트 데이터 없음</div>
            ) : (
              <DayExpenseListTop2
                data={subData.data.daySpendList}
                currentDate={monthNav.currentDate}
              />
            )}
          </DayListContainer>
        </MainContainer>
      </NavigationLayout>
    </>
  );
};

export default MainPage;

const MainContainer = styled.div`
  background-color: transparent;
  width: 100%;
  height: 100%;
  padding: 0 15px 15px 15px;

  ${overflowWithoutScroll}
`;

const BudgetContainer = styled.section<{ $isLoading: boolean }>`
  ${mainSection}
  ${flexColumnBetween}
  flex-direction:  ${(props) => (props.$isLoading ? 'row' : 'column')};
  min-height: 250px;
  width: 100%;
  margin-bottom: 16px;
`;
const CalendarWrapper = styled.section`
  ${mainSection}
  min-height: 150px;
  width: 100%;
  padding: 5px;
  margin-bottom: 16px;
`;
const DayListContainer = styled.section`
  ${mainSection}
  min-height: 170px;
  width: 100%;
`;
