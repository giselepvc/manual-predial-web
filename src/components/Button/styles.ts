import styled from 'styled-components';

interface ButtonProps {
  outlined?: boolean;
}

export const ButtonComponent = styled.button<ButtonProps>`
  width: 134px;
  min-height: 35px;
  box-shadow: ${({ outlined }) =>
    outlined ? 'none' : '0px 4px 4px 0px #00000040'};
  border-radius: 4px;
  border: ${({ theme, outlined }) =>
    outlined ? `1px solid ${theme.colors.gray9a}` : 'none'};
  background-color: ${({ theme, outlined }) =>
    outlined ? theme.colors.grayStronger : theme.colors.primary};

  color: ${({ theme, outlined }) =>
    outlined ? theme.colors.gray9a : theme.colors.white};
  font-size: 12px;
  font-weight: 600;
  line-height: 17.38px;

  animation-timing-function: ease-out;
  animation-duration: 100ms;

  &:hover {
    opacity: 0.9;
  }
`;
