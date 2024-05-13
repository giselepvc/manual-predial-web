import styled from 'styled-components';

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
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
  max-width: 860px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 1.5rem;
  justify-content: space-between;
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

export const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  width: 100%;
  margin: 3rem 0 2rem 0;
`;

export const InputSection = styled.label`
  border: none;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;

  padding: 0;
  width: 632px;
  height: 2.75rem;
  margin-top: 8px;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray9a};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
  }
`;

export const FileButton = styled.div`
  height: 2.75rem;
  width: 150px;

  background: ${({ theme }) => theme.colors.gray4a};
  border-bottom-left-radius: 0.625rem;
  border-top-left-radius: 0.625rem;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray9a};

  display: flex;
  align-items: center;
  justify-content: center;
`;
