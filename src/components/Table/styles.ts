import styled from 'styled-components';

export const TableSection = styled.section`
  margin-top: 1.5rem;

  width: 100%;
  min-height: calc(100vh - 18rem);
  padding: 1rem 1.75rem 0.5rem 1.75rem;

  border-radius: 0.625rem;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.625rem;

  color: ${({ theme }) => theme.colors.grayd9};

  th {
    padding: 0 1rem;
  }

  thead tr th {
    font-size: 1.15rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
    text-align: left;

    &:last-child {
      text-align: center;
    }
  }

  td {
    padding: 0 1rem;
  }

  tbody tr td {
    font-size: 0.875rem;
    font-weight: 600;
    height: 3.4375rem;
    text-align: center;
    background: ${({ theme }) => theme.colors.gray41};
    text-align: left;

    &:first-child {
      border-top-left-radius: 0.625rem;
      border-bottom-left-radius: 0.625rem;
    }

    &:last-child {
      border-top-right-radius: 0.625rem;
      border-bottom-right-radius: 0.625rem;
    }
  }
`;
