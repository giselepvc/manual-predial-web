import styled, { keyframes } from 'styled-components';

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
  min-height: calc(100vh - 20rem);
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
    selected ? theme.colors.primary : theme.colors.grayLight};
  border-radius: 6px;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  span {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.white};

    margin-right: 1.2rem;
  }

  div {
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;

    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const fadeIn = keyframes`
  from {
    height: 0px;
  }
  to {
    height: 50px;
  }
`;

export const TableMore = styled.div<TableProps>`
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-height: 50px;

  padding: 0 2.5rem;
  margin-top: -1rem;
  margin-bottom: ${({ selected }) => (selected ? 0 : '1rem')};

  background: ${({ theme }) => theme.colors.white};
  border: ${({ theme, selected }) =>
    selected
      ? `1px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.gray8f}`};

  color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.grayStronger};
  cursor: pointer;
  animation: ${fadeIn} 0.2s ease-in-out;
`;

export const TableContentMore = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  min-height: 50px;

  padding: 0 2rem 1rem 2.75rem;
  margin-top: -2rem;
  margin-bottom: 1rem;

  background: ${({ theme }) => theme.colors.grayStronger};

  overflow: hidden;
  cursor: pointer;
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const Description = styled.div`
  min-height: 140px;
  width: 100%;

  margin-top: 6px;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.gray3d};

  white-space: pre-line;
  color: ${({ theme }) => theme.colors.grayaa};
  font-weight: 600;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
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

export const ThreadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;

  min-width: 48px;
  height: 50px;
  margin-top: -1rem;

  animation: ${fadeIn} 0.2s ease-in-out;
`;

export const ThreadLine = styled.div`
  min-height: 25px;
  min-width: 24px;
  border-left: ${({ theme }) => `2px solid ${theme.colors.grayaa}`};
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.grayaa}`};
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
`;

interface NavProps {
  selected?: boolean;
}

export const InfoText = styled.div<NavProps>`
  min-height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem 1rem;

  border-top: ${({ theme, selected }) =>
    selected ? `1px solid${theme.colors.primary}` : 'none'};
  border-left: ${({ theme, selected }) =>
    selected ? `1px solid${theme.colors.primary}` : 'none'};
  border-right: ${({ theme, selected }) =>
    selected ? `1px solid${theme.colors.primary}` : 'none'};
  border-radius: 10px 10px 0 0;
  background-color: ${({ theme }) => theme.colors.gray3d};

  color: ${({ theme }) => theme.colors.grayaa};
  font-size: 0.9rem;
  font-weight: 600;

  user-select: none;
`;

export const Img = styled.img`
  max-width: 100%;
  margin-top: 8px;
  border-radius: 6px;

  object-fit: cover;
`;

export const Icon = styled.img`
  width: 14px;
  height: 14px;
`;

export const ColumnDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  span {
    font-size: 0.8rem;
  }
`;
