import styled, { css } from 'styled-components';
import { flexCenter } from '@styles/CommonStyles';

import TopNavigation from '@layout/TopNavigation';

import MetaThemeColor from '@components/background/MetaThemeColor';

type NavLayoutProps = {
  children: React.ReactNode;
  isEdit: boolean;
  isValid: boolean;
  handleSubmit: () => void;
  handleDelete: () => void;
  handleMovePrevPage: () => void;
  toggleEdit: () => void;
};

const NavigationLayout = ({
  children,
  isEdit,
  isValid,
  handleSubmit,
  handleDelete,
  handleMovePrevPage,
  toggleEdit,
}: NavLayoutProps) => {
  return (
    <>
      <MetaThemeColor color="#F4F4F4" />
      <TopNavigation
        _TopBar={
          <TopNavigation.TopBar
            leftContent={
              !isEdit && <TopNavigation.TopBar.PrevButton onClick={handleMovePrevPage} />
            }
            centerContent={
              <TopNavigation.TopBar.CenterTitle>작성완료 내역</TopNavigation.TopBar.CenterTitle>
            }
            rightContent={
              <Toolbar>
                {isEdit ? (
                  <SaveButton onClick={handleSubmit} disabled={isValid}>
                    완료
                  </SaveButton>
                ) : (
                  <EditButton onClick={toggleEdit} />
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
