import styled from 'styled-components';

export const MainComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const IconsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 50px);
  grid-row-gap: 1rem;
  gap: 1rem;
`;

interface ImageProps {
  selected?: boolean;
}

export const ImageButton = styled.div<ImageProps>`
  position: relative;

  height: 45px;
  width: 45px;
  padding: 1rem 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: ${({ theme }) => `1px solid ${theme.colors.gray8f}`};
  border-radius: 4px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : 'transparent'};

  transition: all ease-in 0.3s;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, selected }) =>
      selected ? theme.colors.primary : 'white'};
  }
`;

export const DeleteIcon = styled.div`
  position: absolute;
  top: -7.5px;
  right: -7.5px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 15px;
  height: 15px;

  border-radius: 50%;

  background-color: #ff0000bd;

  font-weight: 900;
`;

export const IconsTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  color: ${({ theme }) => theme.colors.graydf};

  svg {
    ${({ theme }) => theme.colors.graydf};
  }
`;

export const Image = styled.img`
  height: 30px;
  width: 30px;
`;

export const IconWrapper = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FilterRegister = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.black};
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
