import styled, { keyframes } from 'styled-components';

interface NavProps {
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

export const ThreadLine = styled.div`
  min-height: 25px;
  min-width: 24px;
  border-left: ${({ theme }) => `2px solid ${theme.colors.grayaa}`};
  border-bottom: ${({ theme }) => `2px solid ${theme.colors.grayaa}`};
`;

export const TableMore = styled.div<NavProps>`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 50px;
  padding: 0 2.5rem;
  margin-top: -1rem;
  margin-bottom: ${({ selected }) => (selected ? 0 : '1rem')};
  background: ${({ theme }) => theme.colors.grayStronger};
  cursor: pointer;
  animation: ${fadeIn} 0.2s ease-in-out;
`;

export const InfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: ${({ theme }) => theme.colors.grayaa};
`;

export const IconArrow = styled.img`
  width: 20px;
  height: 20px;
`;
