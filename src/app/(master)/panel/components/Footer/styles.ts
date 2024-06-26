import styled from 'styled-components';

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background-color: white;
  gap: 1rem;

  div {
    color: black;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    gap: 3rem;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;

export const LogoImage = styled.img`
  width: 400px;
`;
