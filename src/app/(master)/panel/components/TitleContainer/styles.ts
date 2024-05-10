import styled, { keyframes } from 'styled-components';

interface TableProps {
  selected?: boolean;
}

const fadeIn = keyframes`
  from { height: 0px }
  to { height: 50px }
`;

export const Thread = styled.div`
  display: flex;
  width: 100%;
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
  animation: ${fadeIn} 0.2s ease-in-out;
  cursor: pointer;
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const IconArrow = styled.img`
  width: 20px;
  height: 20px;
`;
