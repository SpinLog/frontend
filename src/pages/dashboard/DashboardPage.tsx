import styled from 'styled-components';
import TopNavigation from '@layout/TopNavigation';
import BottomNavigation from '@layout/BottomNavigation';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useMonthNavigator from '@hooks/useMonthNavigator';
import useDashboardData from './hooks/useDashboardData';

import TabLayout, { TabProps } from '@components/layout/TabLayout';
import MonthNavigatorBtn from '@components/date/MonthNavigatorBtn';
import TabContent from './components/TabContent';
import Spinner from '@components/information/Spinner';
import MetaThemeColor from '@components/background/MetaThemeColor';

import type { TabOption } from './type';

type DashboardNavProps = {
  currentDate: Date;
  previousMonth: () => void;
  nextMonth: () => void;
  children: React.ReactNode;
};

const NavigationLayout = ({
  children,
  currentDate,
  previousMonth,
  nextMonth,
}: DashboardNavProps) => {
  const navigate = useNavigate();
  const monthNavProps = { currentDate, previousMonth, nextMonth };

  return (
    <>
      <MetaThemeColor color="#F4F4F4" />
      <TopNavigation
        _TopBar={
          <TopNavigation.TopBar
            centerContent={
              <TopNavigation.TopBar.CenterTitle>대시보드</TopNavigation.TopBar.CenterTitle>
            }
            rightContent={
              <TopNavigation.TopBar.SettingGrayButton
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
      <BottomNavigation location="dashboard" />
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

const DashboardPage = () => {
  const monthNav = useMonthNavigator(); // monthNav.currentDate = 현재 선택된 월
  const [selectedTab, setSelectedTab] = useState<TabOption>('TAB_SPEND'); // 지출 탭 기본 선택
  const registerType = selectedTab === 'TAB_SPEND' ? 'SPEND' : 'SAVE';

  // react-query가 반응해야 하는 것 : slelectedTab 변경, monthNav.currentDate.getMonth()
  const { data, isLoading, error } = useDashboardData(
    monthNav.currentDate,
    selectedTab,
    registerType,
  );

  const handleTabSelect = (tabId: string) => {
    setSelectedTab(tabId as TabOption);
  };

  const tabData: TabProps<TabOption>[] = [
    {
      id: 'TAB_SPEND',
      label: '지출',
      content:
        isLoading || error ? (
          <InfoWrapper>{error ? <div>An error occurred</div> : <Spinner />}</InfoWrapper>
        ) : (
          <TabContent currentDate={monthNav.currentDate} registerType={'SPEND'} data={data.data} />
        ),
    },
    {
      id: 'TAB_SAVE',
      label: '절약',
      content:
        isLoading || error ? (
          <InfoWrapper>{error ? <div>An error occurred</div> : <Spinner />}</InfoWrapper>
        ) : (
          <TabContent currentDate={monthNav.currentDate} registerType={'SAVE'} data={data.data} />
        ),
    },
  ];
  return (
    <NavigationLayout {...monthNav}>
      <DashboardContainer>
        <TabWrapper>
          <TabLayout tabs={tabData} selectedTab={selectedTab} onTabSelect={handleTabSelect} />
        </TabWrapper>
      </DashboardContainer>
    </NavigationLayout>
  );
};

export default DashboardPage;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;

  margin-top: 10px;

  overflow-y: auto;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 500px;
`;

const TabWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
`;
