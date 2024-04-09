import BackIcon from '../../../public/icons/arrow.svg';

import { PageTitle, PageComponent, BackButton } from './styles';

interface PageProps {
  title: string;
  backButton?: boolean;
  backFunction?: () => void;
}

const PageLayout = ({ title, backButton, backFunction }: PageProps) => {
  return (
    <PageComponent>
      <PageTitle>{title}</PageTitle>

      {backButton && (
        <BackButton onClick={backFunction}>
          <BackIcon />
          Retornar para listagem
        </BackButton>
      )}
    </PageComponent>
  );
};

export default PageLayout;
