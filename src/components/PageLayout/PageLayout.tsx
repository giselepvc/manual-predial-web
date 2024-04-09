import BackIcon from '../../../public/icons/arrow.svg';

import { PageTitle, PageComponent, BackButton } from './styles';

interface PageProps {
  title: string;
  backButton?: boolean;
  backFunction?: () => void;
  children: React.ReactNode;
}

const PageLayout = ({
  title,
  backButton,
  backFunction,
  children,
}: PageProps) => {
  return (
    <PageComponent>
      <PageTitle>{title}</PageTitle>

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
