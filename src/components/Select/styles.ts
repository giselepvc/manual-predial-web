import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
`;

export const LabelText = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c2d38;
`;

export const ErrorMessage = styled.span`
  position: absolute;
  bottom: -1rem;
  left: 0.25rem;

  font-size: 0.625rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
`;
