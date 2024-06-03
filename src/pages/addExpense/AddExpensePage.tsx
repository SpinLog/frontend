// 소비 입력 페이지
import styled from 'styled-components';
import { flexCenter, flexColumnCenter } from '@styles/CommonStyles';

import TopNavigation from '@layout/TopNavigation';
import type { ExpenseFormType } from '@models/expense';

import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import useIsDemoMode from '@hooks/useIsDemo';
import useSaveExpense from './hooks/useSaveExpense';

import WriteExpense from './components/WriteExpense';
import WriteEmotion from './components/WriteEmotion';
import WriteSatisfaction from './components/WriteSatisfaction';

import MetaThemeColor from '@components/background/MetaThemeColor';
import LoadingModal from '@components/modal/LoadingModal';

type AddNavProps = {
  children: React.ReactNode;
  title: string;
  isDemoMode: boolean;
  hasPrev: boolean;
  prevStep: () => void;
};

const NavigationLayout = ({ children, title, isDemoMode, hasPrev, prevStep }: AddNavProps) => {
  const navigate = useNavigate();
  return (
    <>
      <MetaThemeColor color="#F4F4F4" />
      <TopNavigation
        _TopBar={
          <TopNavigation.TopBar
            leftContent={
              hasPrev && (
                <TopNavigation.TopBar.PrevButton
                  onClick={() => {
                    prevStep();
                  }}
                />
              )
            }
            centerContent={
              <TopNavigation.TopBar.CenterTitle>
                {title}
                {isDemoMode && (
                  <span style={{ fontSize: '12px', color: '#47cfb0' }}> (체험중)</span>
                )}
              </TopNavigation.TopBar.CenterTitle>
            }
            rightContent={
              <TopNavigation.TopBar.CloseButton
                onClick={() => {
                  navigate(-1);
                }}
              />
            }
          />
        }
      />
      {children}
    </>
  );
};

const AddExpensePage = () => {
  const isDemoMode = useIsDemoMode();

  // 저장 쿼리
  const expenseMutation = useSaveExpense();
  // 입력 form
  const methods = useForm<ExpenseFormType>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      registerType: 'SPEND', // 소비, 절약
      amount: '', // 금액, #,##0 형태
      content: '', // 소비 내용 (원래 물건)
      spendDate: '', // 소비 날짜, 시간 (저장 시간 아님) -> 추가 필요 필드
      event: '', // 사건
      thought: '', // 생각
      emotion: '', // 감정
      satisfaction: 3, // 만족도
      reason: '', // 만족 이유
      improvements: '', // 개선점
    },
  });

  // 페이지 별 타이틀
  const [title, setTitle] = useState<string>('지출/절약 입력');
  const titleArr = ['지출/절약 입력', '감정 입력', '만족도 입력'];

  // 입력 스탭
  const [currStep, setCurrStep] = useState<number>(0);

  // 다음 단계 (유효성 체크)
  const handleNextStep = async () => {
    // 현재 폼의 모든 입력 값에 대해 유효성 검사 수행
    const result = await methods.trigger();
    if (result) {
      // 유효성 검사를 통과하면 다음 스탭으로 이동
      setTitle(titleArr[currStep + 1]);
      setCurrStep(currStep + 1);
    }
  };

  // 이전 단계 (유효성 체크 x)
  const handlePrevStep = () => {
    // 이전 단계는 유효성 체크 안함
    setTitle(titleArr[currStep - 1]);
    setCurrStep(currStep - 1);
  };

  // 제출
  const handleSubmit = (data: ExpenseFormType) => {
    // amount: #,##0  => 다시 숫자만 남은 형태로 변경 필요
    const numberAmount = data.amount.replace(/,/g, '');
    if (isDemoMode) {
      alert('체험하기로 저장');
    } else {
      expenseMutation.mutate({ ...data, amount: numberAmount });
    }
  };

  return (
    <NavigationLayout
      hasPrev={currStep > 0}
      prevStep={handlePrevStep}
      title={title}
      isDemoMode={isDemoMode}>
      <AddExpenseContainer>
        <FormProvider {...methods}>
          <Form onSubmit={methods.handleSubmit(handleSubmit)}>
            {/* 폼 영역 (멀티 스탭) */}
            {currStep === 0 && <WriteExpense />}
            {currStep === 1 && <WriteEmotion />}
            {currStep === 2 && <WriteSatisfaction />}

            {/* 버튼 영역 */}
            <NextButtonWrapper>
              {currStep < 2 && (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!methods.formState.isValid}>
                  다음
                </Button>
              )}
              {currStep === 2 && <Button type="submit">저장</Button>}
            </NextButtonWrapper>
          </Form>
        </FormProvider>
      </AddExpenseContainer>
      {expenseMutation.isLoading && <LoadingModal />}
    </NavigationLayout>
  );
};

export default AddExpensePage;
const AddExpenseContainer = styled.div`
  ${flexColumnCenter}
  width: 100%;
  height: 100%;
  color: black;
  overflow: hidden;
`;

const NextButtonWrapper = styled.div`
  ${flexCenter}
  width: 100%;
  height: 100px;
  flex-shrink: 0;
`;

const Button = styled.button`
  width: 80%;
  min-width: 358px;
  height: 60px;

  border-radius: 6px;
  background-color: #47cfb0;

  color: #fff;
  font-size: 20px;
  font-weight: 600;

  margin-bottom: 40px;

  &:hover {
    background-color: #6ad5bc;
  }

  &:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  ${flexColumnCenter}
  overflow: hidden;
  width: 100%;
  height: 100%;
`;
