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

export const TextArea = styled.textarea`
  border: none;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;

  padding: 1rem;
  width: 230px;
  height: 7.75rem;
  margin-top: 8px;
  resize: none;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.white};
  outline: none;

  &:disabled {
    color: ${({ theme }) => theme.colors.gray9a};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray9a};
  }

  &:focus-visible {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.35);
  }
`;

export const RadiosRow = styled.div`
  width: 100%;
  margin-top: 10px;
  padding-left: 0.85rem;

  display: grid;
  grid-template-columns: repeat(auto-fit, 50px);
  grid-row-gap: 1rem;
  gap: 1rem;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayd9};
`;

export const Checkbox = styled.input`
  appearance: none;
  -moz-appearance: none;

  height: 15px;
  width: 15px;
  min-width: 15px;
  min-height: 15px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.grayd9};
  background: transparent;

  cursor: pointer;

  &:checked {
    background: ${({ theme }) => theme.colors.primary};
  }
`;
