import styled from 'styled-components';

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

export const Image = styled.img`
  width: 20px;
  height: 20px;
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
