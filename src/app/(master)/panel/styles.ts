import styled from 'styled-components';

export const Separator = styled.form`
  margin-bottom: 1rem;
`;

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

export const Content = styled.section`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 10rem);
  padding: 1.875rem 1.75rem;
  margin-bottom: 2rem;
  border-radius: 0.625rem;
  border: ${({ theme }) => `1px solid ${theme.colors.grayLight}`};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: center;
  align-items: center;
`;

export const Table = styled.section`
  width: 100%;
  height: 100%;
  background: transparent;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: end;
`;

export const Thread = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 3rem;
`;

export const Image = styled.img`
  max-height: 300px;
`;

export const LogoImage = styled.img`
  width: 400px;
`;

export const Hidden = styled.div`
  display: none;
`;
