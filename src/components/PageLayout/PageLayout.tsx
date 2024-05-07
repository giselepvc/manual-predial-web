/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import BackIcon from '../../../public/icons/arrow.svg';
import ExitIcon from '../../../public/icons/exit.svg';

import { PageTitle, PageComponent, BackButton } from './styles';

interface PageProps {
  title?: string;
  backButton?: boolean;
  hasLogo?: boolean;
  backFunction?: () => void;
  children: React.ReactNode;
}

const PageLayout = ({
  title,
  hasLogo,
  backButton,
  backFunction,
  children,
}: PageProps) => {
  const { logout } = useAuth();

  return (
    <PageComponent style={hasLogo ? { padding: '1rem 2.5rem 0 2.5rem' } : {}}>
      {title && <PageTitle>{title}</PageTitle>}

      {hasLogo && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Image src="/img/logo.svg" alt="Logo" width={200} height={80} />

          <div
            style={{
              display: 'flex',
              cursor: 'pointer',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onClick={() => logout()}
          >
            <ExitIcon /> Sair
          </div>
        </div>
      )}

      {backButton && (
        <BackButton onClick={backFunction}>
          <BackIcon />
          Retornar para listagem
        </BackButton>
      )}

      {children}
    </PageComponent>
  );
};

export default PageLayout;
