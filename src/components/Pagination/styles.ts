import styled from 'styled-components';

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;

  ul {
    list-style: none;

    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.gray41};

    border: 1px solid ${({ theme }) => theme.colors.gray41};
    border-radius: 0.625rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  li a {
    height: 2.625rem;
    min-height: 2.625rem;
    width: 2.625rem;
    min-width: 2.625rem;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${({ theme }) => theme.colors.white};
    font-size: 1rem;

    cursor: pointer;

    background: ${({ theme }) => theme.colors.gray3d};

    transition: filter 0.2s;

    &:hover,
    &:focus {
      filter: brightness(0.95);
    }
  }

  .selected {
    a {
      color: ${({ theme }) => theme.colors.white};
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  .previous,
  .next {
    a {
      width: fit-content;
      padding: 0 1.5rem;
      gap: 0.5rem;
    }
  }

  .previous {
    a {
      border-top-left-radius: 0.625rem;
      border-bottom-left-radius: 0.625rem;
    }

    border-right: 1px solid ${({ theme }) => theme.colors.gray3d};
  }

  .next {
    a {
      border-top-right-radius: 0.625rem;
      border-bottom-right-radius: 0.625rem;
    }

    border-left: 1px solid ${({ theme }) => theme.colors.gray3d};
  }
`;

export const PaginationSection = styled.section`
  padding: 2rem 0 2.625rem 0;

  width: 100%;

  display: flex;
  justify-content: center;
`;
