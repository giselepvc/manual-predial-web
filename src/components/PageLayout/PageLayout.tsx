import { useAuth } from '@/hooks/useAuth';
import BackIcon from '../../../public/icons/arrow.svg';
import ExitIcon from '../../../public/icons/exit.svg';
import { Title, Component, BackButton, Image, Button, Header } from './styles';

interface PageProps {
  title?: string;
  backButton?: boolean;
  hasLogo?: boolean;
  backFunction?: () => void;
  children: React.ReactNode;
  logo?: string;
}

const PageLayout = ({
  logo,
  title,
  hasLogo,
  backButton,
  backFunction,
  children,
}: PageProps) => {
  const { logout } = useAuth();

  const styles = {
    padding: '1rem 2.5rem 0 2.5rem',
    backgroundColor: 'white',
  };

  return (
    <Component style={hasLogo ? styles : {}}>
      {title && <Title>{title}</Title>}

      {hasLogo && (
        <Header>
          <Image src={logo || '/img/logo.svg'} alt="Logo" />
          <Button onClick={() => logout()}>
            <ExitIcon color="#000000" /> Sair
          </Button>
        </Header>
      )}

      {backButton && (
        <BackButton onClick={backFunction}>
          <BackIcon />
          Retornar para listagem
        </BackButton>
      )}

      {children}
    </Component>
  );
};

export default PageLayout;
