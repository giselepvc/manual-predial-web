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
  grid-column-gap: 1.2rem;
  grid-row-gap: 1rem;
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

export const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  width: 100%;
  margin: 1rem 0;
`;

export const Content = styled.section`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 31rem);
  padding: 1.875rem 1.75rem;

  border-radius: 0.625rem;
  background: ${({ theme }) => theme.colors.black};
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

interface TableProps {
  selected?: boolean;
}

export const TableRow = styled.div<TableProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-height: 50px;
  padding: 0 2.5rem;
  margin-bottom: 1rem;

  background: ${({ theme, selected }) =>
    selected ? theme.colors.gray3a : theme.colors.grayStronger};
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

export const RadiosRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 10px;
  padding-left: 0.85rem;
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
