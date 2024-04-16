import styled from 'styled-components';

export const MainComponent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const IconsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 50px);
`;

interface ImageProps {
  selected?: boolean;
}

export const ImageButton = styled.div<ImageProps>`
  height: 40px;
  width: 45px;
  padding: 1rem 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: ${({ theme }) => `1px solid ${theme.colors.gray8f}`};
  border-radius: 4px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : 'transparent'};
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
