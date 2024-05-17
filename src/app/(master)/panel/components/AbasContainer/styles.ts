import styled from 'styled-components';

interface TableProps {
  selected?: boolean;
  hasLast?: boolean;
  italic?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.white};
  margin-top: -2rem;
  margin-bottom: 1rem;
  padding: 1rem 3rem;
  border: none;
`;

export const Title = styled.div`
  color: ${({ theme }) => theme.colors.grayStronger};
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const InfoSection = styled.div`
  display: flex;
  gap: 0.2rem;
`;

export const InfoColumnSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Description = styled.div<TableProps>`
  width: 100%;
  margin-top: 6px;
  padding: ${({ hasLast }) => (hasLast ? '0 0 1.5rem 0' : 0)};
  border-radius: 6px;
  background-color: transparent;
  white-space: pre-line;
  color: ${({ theme }) => theme.colors.grayStronger};
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
  background-color: ${({ theme }) => theme.colors.primary};
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
    color: ${({ theme }) => theme.colors.grayStronger};
    font-size: 0.8rem;
    font-style: italic;
  }
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
  color: ${({ theme }) => theme.colors.grayStronger};
  font-size: 1rem;
  font-weight: 600;
  user-select: none;

  &:hover {
    background-color: #e0e0e0;
  }
`;
