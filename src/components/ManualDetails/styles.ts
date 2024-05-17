import styled from 'styled-components';

export const StepsPage = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const Header = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 3rem;
`;

export const Content = styled.section`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 14rem);
  padding: 1.875rem 1.75rem;
  border-radius: 0.625rem;
  background: ${({ theme }) => theme.colors.black};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: center;
  align-items: center;
`;

export const TableSection = styled.section`
  width: 100%;
  height: 100%;
  background: transparent;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: end;
`;

export const RegisterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${({ theme }) => theme.colors.grayaa};

  span {
    color: ${({ theme }) => theme.colors.graydf};
    font-size: 0.9rem;
  }
`;

export const ThreadLineTwo = styled.div`
  min-height: 100px;
  padding-top: auto;
  width: 24px;
  border-left: ${({ theme }) => `2px solid ${theme.colors.grayaa}`};
`;

export const Thread = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 3rem;
`;

export const Separator = styled.form`
  margin-bottom: 1rem;
`;
