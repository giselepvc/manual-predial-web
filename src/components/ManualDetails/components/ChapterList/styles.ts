import styled from 'styled-components';

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
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.grayaa};
`;

export const IconArrow = styled.img`
  width: 20px;
  height: 20px;
`;
