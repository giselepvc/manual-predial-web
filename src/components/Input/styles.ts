import styled from 'styled-components';

export const Input = styled.input`
  border: none;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;

  padding: 0 1rem;
  width: 230px;
  height: 2.75rem;
  margin-top: 8px;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray9a};
  }

  &:focus-visible {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
  }
`;
