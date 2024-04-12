import styled from 'styled-components';

export const StepsPage = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
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

export const TableSection = styled.section`
  width: 100%;
  height: calc(100vh - 24rem);
  max-height: calc(100vh - 24rem);
  padding: 1.875rem 1.75rem;

  border-radius: 0.625rem;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
    selected ? theme.colors.gray3a : theme.colors.gray41};
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

export const TableMore = styled.div<TableProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 98%;
  min-height: 50px;
  padding: 0 2.5rem;
  margin-top: -1rem;
  margin-bottom: 1rem;

  background: ${({ theme }) => theme.colors.gray41};

  cursor: pointer;

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.grayd9};
    margin-right: 3.4rem;
  }

  div {
    color: ${({ theme }) => theme.colors.grayaa};
    font-weight: 600;
  }
`;

export const TableDetails = styled.div<TableProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 96%;
  min-height: 100px;
  padding: 0 2.5rem;
  margin-top: -1rem;
  margin-bottom: 1rem;

  background: ${({ theme }) => theme.colors.gray41};

  cursor: pointer;

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.grayd9};
    margin-right: 3.4rem;
  }

  div {
    color: ${({ theme }) => theme.colors.grayaa};
    font-weight: 600;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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

export const NotListText = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.grayaa};
  font-size: 20px;
  font-weight: 700;
`;
