import styled, { css } from 'styled-components';
import { flexCenter } from '@styles/CommonStyles';

import TopNavigation from '@layout/TopNavigation';
import MetaThemeColor from '@components/background/MetaThemeColor';

type NavLayoutProps = {
  children: React.ReactNode;
  isValid: boolean;
  isEditMode: boolean;
  isDemoMode: boolean;
  handleUpdate: () => void;
  handleDelete: () => void;
  handleMovePrevPage: () => void;
  toggleEditMode: () => void;
};

const NavigationLayout = ({
  children,
  isValid,
  isEditMode,
  isDemoMode,
  handleUpdate,
  handleDelete,
  handleMovePrevPage,
  toggleEditMode,
}: NavLayoutProps) => {
  return (
    <>
      <MetaThemeColor color="#F4F4F4" />
      <TopNavigation
        _TopBar={
          <TopNavigation.TopBar
            leftContent={
              !isEditMode && <TopNavigation.TopBar.PrevButton onClick={handleMovePrevPage} />
            }
            centerContent={
              <TopNavigation.TopBar.CenterTitle>
                작성완료 내역
                {isDemoMode && (
                  <span style={{ fontSize: '12px', color: '#47cfb0' }}> (체험중)</span>
                )}
              </TopNavigation.TopBar.CenterTitle>
            }
            rightContent={
              <Toolbar>
                {isEditMode ? (
                  <SaveButton onClick={handleUpdate} disabled={isValid}>
                    완료
                  </SaveButton>
                ) : (
                  <EditButton onClick={toggleEditMode} />
                )}
                <DeleteButton onClick={handleDelete} />
              </Toolbar>
            }
          />
        }
      />
      {children}
    </>
  );
};

export default NavigationLayout;

const Toolbar = styled.div`
  ${flexCenter}
  gap: 16px;
`;

const toolbarStyle = css`
  width: 24px;
  height: 24px;
  color: #bcbcbc;
  cursor: pointer;

  &:hover {
    color: #47cfb0;
  }
`;

const EditButton = styled(TopNavigation.TopBar.EditButton)`
  ${toolbarStyle}
`;

const DeleteButton = styled(TopNavigation.TopBar.DeleteButton)`
  ${toolbarStyle}
`;

const SaveButton = styled.button`
  color: #47cfb0;
  font-size: 16px;
  font-weight: 700;
  &:hover {
    filter: brightness(1.1);
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    &:hover {
      filter: none;
    }
  }
`;
