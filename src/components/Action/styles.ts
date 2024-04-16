import styled from 'styled-components';

export const FilterRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
`;

export const FilterSection = styled.div`
  position: relative;
`;

export const FilterInput = styled.input`
  border: none;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;

  padding: 0 3rem;
  width: 100%;
  min-width: 280px;
  height: 2.75rem;

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

export const FilterButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;

  border: none;
  background: transparent;

  height: 2.75rem;
  width: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 1.875rem;
    color: ${({ theme }) => theme.colors.gray9a};
  }
`;

export const FilterRegister = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;

  width: 100%;
  width: 280px;
  height: 2.75rem;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray9a};
  outline: none;

  svg {
    width: 1rem;
    color: ${({ theme }) => theme.colors.gray9a};
    margin-right: 0.5rem;
  }

  animation-timing-function: ease-out;
  animation-duration: 100ms;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);

    svg {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;
