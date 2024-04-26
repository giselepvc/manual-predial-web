'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { urlBuild } from '@/utils/urlBuild';
import UserIcon from '../../../public/icons/user.svg';
import TractorIcon from '../../../public/icons/tractor.svg';
import EnterpriseIcon from '../../../public/icons/enterprise.svg';
import BookIcon from '../../../public/icons/book.svg';
import SettingsIcon from '../../../public/icons/settings.svg';
import ExitIcon from '../../../public/icons/exit.svg';
import {
  BottomSection,
  LogoButton,
  LogoImg,
  LogoTextImg,
  LogoutButton,
  LogoutSection,
  Nav,
  NavLink,
  NavLinkText,
  NavbarContainer,
  ProfileImg,
} from './styles';

const Navbar = () => {
  const { logout, user, role } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const renderImage = () => {
    return user?.users?.image?.url
      ? urlBuild(user?.users?.image?.url)
      : '/icons/image.svg';
  };

  const isCompany = role === 1;
  const isViewer = role === 4;
  const isMaster = role === 3;

  return (
    <NavbarContainer>
      <LogoButton type="button" onClick={() => setExpanded(prev => !prev)}>
        <LogoImg src="/img/logo_icon.svg" alt="logo" />
        <LogoTextImg src="/img/logo_text.svg" alt="predial" open={expanded} />
      </LogoButton>

      <Nav open={expanded}>
        {isMaster && (
          <NavLink href="/company" selected={pathname.startsWith('/company')}>
            <TractorIcon />
            <NavLinkText selected={pathname.startsWith('/company')}>
              Listagem de construtoras
            </NavLinkText>
          </NavLink>
        )}

        {isMaster && (
          <NavLink
            href="/enterprise"
            selected={pathname.startsWith('/enterprise')}
          >
            <EnterpriseIcon />
            <NavLinkText selected={pathname.startsWith('/enterprise')}>
              Listagem de empreendimentos
            </NavLinkText>
          </NavLink>
        )}

        {isMaster && (
          <NavLink href="/group" selected={pathname.startsWith('/group')}>
            <EnterpriseIcon />
            <NavLinkText selected={pathname.startsWith('/group')}>
              Listagem de grupos
            </NavLinkText>
          </NavLink>
        )}

        {isMaster && (
          <NavLink href="/users" selected={pathname.startsWith('/users')}>
            <UserIcon />
            <NavLinkText selected={pathname.startsWith('/users')}>
              Listagem de usuários
            </NavLinkText>
          </NavLink>
        )}

        {(isMaster || isCompany) && (
          <NavLink href="/final" selected={pathname.startsWith('/final')}>
            <UserIcon />
            <NavLinkText selected={pathname.startsWith('/final')}>
              Listagem de usuários final
            </NavLinkText>
          </NavLink>
        )}

        {(isMaster || isCompany) && (
          <NavLink href="/manual" selected={pathname.startsWith('/manual')}>
            <BookIcon />
            <NavLinkText selected={pathname.startsWith('/manual')}>
              Listagem de manuais
            </NavLinkText>
          </NavLink>
        )}

        {isMaster && (
          <NavLink href="/icons" selected={pathname.startsWith('/icons')}>
            <BookIcon />
            <NavLinkText selected={pathname.startsWith('/icons')}>
              Listagem de ícones
            </NavLinkText>
          </NavLink>
        )}

        {isViewer && (
          <NavLink href="/panel" selected={pathname.startsWith('/panel')}>
            <BookIcon />
            <NavLinkText selected={pathname.startsWith('/panel')}>
              Painel do empreendimento
            </NavLinkText>
          </NavLink>
        )}

        <NavLink
          href="/config"
          selected={pathname.startsWith('/config')}
          style={{ paddingLeft: '1.5rem' }}
        >
          <SettingsIcon />
          <NavLinkText selected={pathname.startsWith('/config')}>
            Configurações
          </NavLinkText>
        </NavLink>
      </Nav>

      <BottomSection>
        <LogoutSection expanded={expanded}>
          {expanded && (
            <div
              style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}
            >
              <ProfileImg src={renderImage()} alt="imagem progile" />
              <span>{user?.name || 'Cliente'}</span>
            </div>
          )}

          <LogoutButton
            type="button"
            onClick={() => {
              logout();
            }}
          >
            <ExitIcon />
          </LogoutButton>
        </LogoutSection>
      </BottomSection>
    </NavbarContainer>
  );
};

export default Navbar;
