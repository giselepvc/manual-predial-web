import styled, { keyframes } from 'styled-components';

const detailsFadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

interface TableProps {
  selected?: boolean;
  hasLast?: boolean;
  italic?: boolean;
}

export const TableDetails = styled.div<TableProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 2.5rem 1.4rem 2.5rem;
  margin-top: -0.5rem;
  margin-bottom: ${({ hasLast }) => (hasLast ? '1rem' : 0)};
  background: ${({ theme }) => theme.colors.grayStronger};
  border-left: none;
  cursor: pointer;
`;

export const InfoSection = styled.div`
  display: flex;
  gap: 0.2rem;
  animation: ${detailsFadeIn} 0.4s ease-in-out;
`;

export const InfoColumnSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Description = styled.div<TableProps>`
  width: 100%;
  margin-top: 6px;
  padding: ${({ hasLast }) => (hasLast ? '0 0 1.5rem 0' : 0)};
  border-radius: 6px;
  background-color: transparent;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.grayaa};
  font-weight: 600;
  font-style: ${({ italic }) => (italic ? 'italic' : 'normal')};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;
  padding: 2px;
  border-radius: 2px;
  margin-top: 8px;
  margin-right: 5px;
`;

export const Img = styled.img`
  max-width: 100%;
  margin-top: 8px;
  border-radius: 6px;
  object-fit: cover;
`;

export const ColumnDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  span {
    color: ${({ theme }) => theme.colors.grayaa};
    font-size: 0.8rem;
    font-style: italic;
  }
`;

interface NavProps {
  selected?: boolean;
}

export const InfoText = styled.div<NavProps>`
  min-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.75rem 2rem;
  border-top: ${({ theme, selected }) =>
    `1px solid ${selected ? theme.colors.white : theme.colors.gray8f}`};
  border-left: ${({ theme, selected }) =>
    `1px solid ${selected ? theme.colors.white : theme.colors.gray8f}`};
  border-right: ${({ theme, selected }) =>
    `1px solid ${selected ? theme.colors.white : theme.colors.gray8f}`};
  border-radius: 10px 10px 0 0;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.grayStronger : theme.colors.grayLight};
  color: ${({ theme, selected }) =>
    selected ? theme.colors.white : theme.colors.grayaa};
  font-size: 0.8rem;
  font-weight: ${({ selected }) => (selected ? 700 : 600)};
  user-select: none;
`;

export const IconNavbar = styled.img`
  width: 16px;
  height: 16px;
`;

export const ButtonDownload = styled.div`
  min-height: 40px;
  min-width: 150px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem 2rem;
  border: ${({ theme }) => `1px solid ${theme.colors.gray8f}`};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.grayaa};
  font-size: 1rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    background-color: #e0e0e0;
  }
`;
