import styled from 'styled-components';

export const Component = styled.main`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding: 3rem 2.5rem 0 2.5rem;
`;

export const Title = styled.h1`
  font-size: 1.625rem;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  margin-bottom: 2rem;
`;

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  margin-bottom: 2rem;

  color: ${({ theme }) => theme.colors.grayaa};
  font-weight: 600;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.grayaa};
  }
`;

export const Image = styled.img`
  height: 100px;
  max-width: 200px;
  object-fit: contain;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Button = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 0.5rem;
  color: black;
`;
