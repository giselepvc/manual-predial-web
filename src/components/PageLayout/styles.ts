import styled from 'styled-components';

export const PageComponent = styled.main`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 3rem 2.5rem 0 2.5rem;
`;

export const PageTitle = styled.h1`
  font-size: 1.625rem;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
`;

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  margin-top: 2rem;

  color: ${({ theme }) => theme.colors.grayaa};
  font-weight: 600;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.grayaa};
  }
`;
