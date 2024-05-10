import styled from 'styled-components';

export const StepsPage = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const HeaderLogo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background-color: white;

  div {
    color: black;
    font-size: 1rem;
    font-weight: 600;
  }
`;

export const Header = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 3rem;
`;

export const Field = styled.div`
  position: relative;
  width: 100%;
  max-width: 27.75rem;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  padding-left: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayd9};
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

export const TableSection = styled.section`
  width: 100%;
  height: 100%;
  background: transparent;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: end;
`;

export const RegisterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: ${({ theme }) => theme.colors.grayaa};

  span {
    color: ${({ theme }) => theme.colors.graydf};
    font-size: 0.9rem;
  }
`;

export const FormSection = styled.section`
  width: 100%;
  max-width: 1166px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;
`;

export const ThreadLineTwo = styled.div`
  min-height: 100px;
  padding-top: auto;
  width: 24px;
  border-left: ${({ theme }) => `2px solid ${theme.colors.grayaa}`};
`;

export const Thread = styled.div`
  display: flex;
  width: 100%;
  padding-left: 3rem;
`;

export const Image = styled.img`
  width: 600px;
`;
