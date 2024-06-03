import styled, { css } from 'styled-components';
import {
  flexBetween,
  flexCenter,
  flexColumnCenter,
  mainSection,
  overflowWithoutScroll,
} from '@styles/CommonStyles';
import { PrevBtn } from '@components/button';

import TopNavigation from '@layout/TopNavigation';
import BottomNavigation from '@layout/BottomNavigation';

import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import useExpenseListData from './hooks/useExpenseListData';
import useIsDemoMode from '@hooks/useIsDemo';

import type { ExpenseFilterType, ExpenseSummaryType } from '@models/expense';
import { EmotionKeys, Registers } from '@models/index';
import { PagePath } from '@models/navigation';

import SearchCondition from './components/SearchCondition';
import ExpenseSummary from '@components/expense/ExpenseSummary';

import Spinner from '@components/information/Spinner';
import Background from '@components/background';
import MetaThemeColor from '@components/background/MetaThemeColor';

import { cloneDeep } from 'lodash';
import { endOfMonth, startOfMonth } from 'date-fns';

type NavLayoutProps = {
  children: React.ReactNode;
  isDemoMode: boolean;
};

const NavigationLayout = ({ children, isDemoMode }: NavLayoutProps) => {
  const navigate = useNavigate();

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
            centerContent={
              <TopNavigation.TopBar.CenterTitle style={{ color: '#ffffff' }}>
                내역 조회
                {isDemoMode && (
                  <span style={{ fontSize: '12px', color: '#ffffff' }}> (체험중)</span>
                )}
              </TopNavigation.TopBar.CenterTitle>
            }
            rightContent={
              <TopNavigation.TopBar.SettingGreenButton
                onClick={() => {
                  navigate(PagePath.Setting);
                }}
              />
            }
          />
        }
      />
      {children}
      <BottomNavigation location={PagePath.ExpenseListView} />
      {showBackground && <Background height="60px" color="#47CFB0" />}
    </>
  );
};

const ExpenseListViewPage = () => {
  const isDemoMode = useIsDemoMode();
  const inputRef = useRef<HTMLInputElement>(null); // 검색창 input Ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDesc, setIsDesc] = useState<boolean>(true); // 내림차순 = 최신순
  const toggleDesc = () => setIsDesc((prev) => !prev);

  const now = new Date();

  // 검색 조건 상태
  const [condition, setCondition] = useState<ExpenseFilterType>({
    registerType: [...Registers],
    emotion: [...EmotionKeys],
    from: startOfMonth(now), //미 선택 시, 당월
    to: endOfMonth(now),
    satisfaction: [1, 2, 3, 4, 5],
    word: inputRef.current ? inputRef.current.value : '',
  });

  // 무한 스크롤 구현, 데이터 정렬은 최신순 고정(서버에서 그렇게 보내줌)
  const { expensesData, isLoading, error, fetchNextPage, hasNextPage, refetch } =
    useExpenseListData(condition);

  // 검색 조건이 변경될 때 쿼리를 다시 실행
  useEffect(() => {
    if (!isDemoMode) {
      refetch();
    }
  }, [condition, refetch, isDemoMode]);

  // 추가 데이터 로드
  const loadMore = useCallback(() => {
    if (hasNextPage && !isDemoMode) fetchNextPage();
  }, [hasNextPage, fetchNextPage, isDemoMode]);

  // 무한 스크롤 이벤트 핸들러
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const onScroll = () => {
      if (
        scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >=
        scrollContainer.scrollHeight
      ) {
        loadMore();
      }
    };

    scrollContainer.addEventListener('scroll', onScroll);
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, [hasNextPage, fetchNextPage, loadMore]);

  // 필터에서 적용버튼 눌렀을 때 적용할 데이터로 condition 상태 업데이트 -> 바로 검색
  const updateCondition = (data: ExpenseFilterType) => {
    setCondition(() => {
      const newCondition = cloneDeep(data);
      return newCondition;
    });
  };

  // 현재 상태의 조건을 가지고 서버에 데이터 요청하는 함수
  const handleSearch = (currentCondition: ExpenseFilterType) => {
    // 1. 현재 상태 키워드로 업데이트
    const sendData = {
      ...cloneDeep(currentCondition),
      word: inputRef.current ? inputRef.current.value : '',
    };

    // 2. 상태를 업데이트하여 query 실행
    setCondition(sendData);
  };

  // 검색 실행
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault(); // 폼 제출을 방지
    if (inputRef.current) inputRef.current.blur(); // 모바일 키보드 숨기기
    handleSearch(condition);
  };

  // 최신순/오래된순 정렬에 따라 배열 뒤집기. (spendList는 렌더링 부분에서 한번 또 뒤집어야함)
  const pagesData = expensesData
    ? isDesc
      ? expensesData.pages
      : [...expensesData.pages].reverse()
    : [];

  return (
    <NavigationLayout isDemoMode={isDemoMode}>
      <ExpenseListViewContainer>
        <SearchCondition
          inputRef={inputRef}
          condition={condition}
          handleKeyDown={handleKeyDown}
          updateCondition={updateCondition}
        />
        <ExpenseListContainer>
          <ExpenseListHeader>
            <span className="title">감정소비 리스트</span>
            <span className="sort" onClick={toggleDesc}>
              {isDesc ? (
                <>
                  최신순 <Arrow deg={'270deg'} />
                </>
              ) : (
                <>
                  오래된순 <Arrow deg={'90deg'} />
                </>
              )}
            </span>
          </ExpenseListHeader>
          <ExpenseListContent ref={scrollContainerRef} $isLoading={isLoading}>
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <div>Error...</div>
            ) : (
              pagesData?.map((page) => {
                const spendList = isDesc ? page.data.spendList : [...page.data.spendList].reverse();
                return spendList.length === 0 ? (
                  <EmptyMessage>조회 결과가 없습니다.</EmptyMessage>
                ) : (
                  spendList.map((expenseSummary: ExpenseSummaryType) => (
                    <ExpenseBox key={expenseSummary.articleId}>
                      <ExpenseSummary {...expenseSummary} />
                    </ExpenseBox>
                  ))
                );
              })
            )}
          </ExpenseListContent>
        </ExpenseListContainer>
      </ExpenseListViewContainer>
    </NavigationLayout>
  );
};

export default ExpenseListViewPage;

const ExpenseListViewContainer = styled.div`
  ${flexColumnCenter}
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ExpenseListContainer = styled.section`
  ${flexColumnCenter}
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 10px 16px 0 16px;
`;

// 제목, 정렬박스
const ExpenseListHeader = styled.div`
  ${flexBetween}
  width: 100%;
  height: 50px;
  flex-shrink: 0;

  & span.title {
    color: ${(props) => props.theme.font};
    font-size: 20px;
    font-weight: 700;
  }

  & span.sort {
    ${flexCenter}
    gap: 3px;
    color: #767676;
    font-size: 14px;
    font-weight: 600;

    cursor: pointer;

    &:hover {
      font-weight: 800;
    }
  }
`;
const ExpenseListContent = styled.div<{ $isLoading: boolean }>`
  ${flexColumnCenter}
  justify-content: ${(props) => (props.$isLoading ? '' : 'flex-start')};
  ${overflowWithoutScroll}
  width: 100%;
  height: 100%;
  gap: 12px;
`;

const ExpenseBox = styled.div`
  ${mainSection}
  width: 100%;
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

  &:hover {
    color: #9f9f9f;
    transform: rotate(${(props) => props.deg});
    stroke-width: 4;
  }
`;

const EmptyMessage = styled.div`
  ${flexCenter}
  height: 100%;
  font-size: 16px;
  color: #767676;
`;
