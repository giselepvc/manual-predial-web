import styled from 'styled-components';

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  width: 100%;
  margin: 1rem 0 2rem 0;
`;

export const FormSection = styled.section`
  width: 100%;
  max-width: 1166px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 0.8rem;
  grid-row-gap: 1.5rem;
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

export const ErrorMessage = styled.h3`
  position: absolute;
  bottom: -1.25rem;
  left: 0.25rem;

  font-size: 8pt;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.error};
`;

export const Content = styled.section`
  width: 100%;
  height: calc(100vh - 24rem);
  max-height: calc(100vh - 24rem);
  padding: 1.875rem 1.75rem;

  border-radius: 0.625rem;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: center;
  align-items: center;
`;

export const ContentSection = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
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

export const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-height: 50px;
  padding: 0 2.5rem;
  margin-bottom: 1rem;

  background: ${({ theme }) => theme.colors.gray41};
  border-radius: 6px;

  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.gray3a};
  }

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.grayd9};
    margin-right: 1.2rem;
  }

  div {
    color: ${({ theme }) => theme.colors.grayaa};
    font-weight: 600;

    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
