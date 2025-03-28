import Link from 'next/link';
import styled, { css } from 'styled-components';

export const NavbarContainer = styled.div`
  height: 100%;
  border-radius: 0px 10px 10px 0px;
  background: #1b1b1b;
  box-shadow: 0px 4px 4px 0px #00000040;
  padding-top: min(6vh, 4.25rem);
  padding-bottom: 2.375rem;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const LogoButton = styled.button`
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
`;

export const LogoImg = styled.img`
  height: 38px;
  object-fit: cover;
  object-position: center;
`;

interface LogoTextImgProps {
  open: boolean;
}

export const LogoTextImg = styled.img<LogoTextImgProps>`
  max-width: ${({ open }) => (open ? '202px' : '0px')};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  padding-left: ${({ open }) => (open ? '0.5rem' : '0')};
  overflow: hidden;
  height: 26px;
  object-fit: cover;
  object-position: center;
  transition: all 0.2s;
`;

interface NavLinkProps {
  selected: boolean;
}

export const NavLink = styled(Link)<NavLinkProps>`
  position: relative;
  padding: 0 1rem;
  height: 3.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  background: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'transparent'};
  text-decoration: none;
  color: ${({ theme, selected }) =>
    selected ? theme.colors.white : theme.colors.gray8f};

  svg {
    font-size: 1.75rem;
    color: ${({ selected, theme }) =>
      selected ? theme.colors.white : theme.colors.gray8f};
  }

  transition: all 0.2s;

  &:focus,
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};

    svg {
      color: ${({ theme }) => theme.colors.white};
    }
  }

  ${({ selected }) =>
    selected &&
    css`
      &::after {
        content: ' ';
        position: absolute;

        left: -1.475rem;
        top: 0;
        bottom: 0;

        width: 0.375rem;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        background: ${({ theme }) => theme.colors.primary};
      }
    `}
`;

export const NavLinkText = styled.p<NavLinkProps>`
  font-size: 0.9rem;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;
`;

interface NavProps {
  open: boolean;
}

export const Nav = styled.nav<NavProps>`
  margin-top: min(6vh, 6.625rem);

  width: fit-content;

  padding-left: 1.625rem;
  padding-right: 1.875rem;

  display: flex;
  flex-direction: column;
  gap: 0.275rem;

  ${({ open }) =>
    open
      ? css`
          ${NavLinkText} {
            padding-left: 0.5rem;
            visibility: visible;
            max-width: 15.625rem;
          }
        `
      : css`
          ${NavLinkText} {
            max-width: 0px;
            padding: 0;

            visibility: hidden;
          }
        `}
`;

export const LogoutButton = styled.button`
  border: none;
  background: transparent;

  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray8f};

  svg {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.gray8f};
  }
`;

interface BottomProps {
  expanded?: boolean;
}

export const BottomSection = styled.div`
  margin-top: auto;
  width: 100%;

  padding-left: 1.625rem;
  padding-right: 1.875rem;
`;

export const LogoutSection = styled.div<BottomProps>`
  padding: 0 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 75px;
  width: 100%;

  border-radius: 8px;
  background: ${({ theme }) => theme.colors.grayStronger};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray8f};

  div > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 130px;
  }
`;

export const ProfileImg = styled.img`
  height: 30px;
  width: 30px;

  border-radius: 50px;
  border: ${({ theme }) => `1px solid ${theme.colors.gray8f}`};

  object-fit: cover;
`;
