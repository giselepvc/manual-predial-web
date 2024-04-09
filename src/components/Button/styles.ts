import styled from 'styled-components';

export const ButtonComponent = styled.button`
  width: 134px;
  min-height: 35px;
  box-shadow: 0px 4px 4px 0px #00000040;
  border-radius: 4px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.white};
  font-size: 12px;
  font-weight: 600;
  line-height: 17.38px;

  animation-timing-function: ease-out;
  animation-duration: 100ms;
`;
