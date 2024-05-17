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
    selected ? theme.colors.primary : theme.colors.grayLight};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const IconArrow = styled.img`
  width: 20px;
  height: 20px;
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;
