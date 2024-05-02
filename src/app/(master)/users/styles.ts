import styled from 'styled-components';

export const ActionButton = styled.div`
  display: flex;
  gap: 0.3rem;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  animation-timing-function: ease-out;
  animation-duration: 100ms;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const ActionsRows = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
`;
