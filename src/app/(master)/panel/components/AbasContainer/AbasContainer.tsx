import { ContainerData } from '@/interfaces/content';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import { FaDownload } from 'react-icons/fa6';
import { theme } from '@/styles/theme';
import {
  ButtonDownload,
  ColumnDetails,
  Description,
  Icon,
  Img,
  InfoSection,
  Container,
  Title,
} from './styles';

interface AbasContainerProps {
  loading?: boolean;
  subContainer: RecursiveNormalize<ContainerData[]> | [];
  title: string;
}

const AbasContainer = ({
  title,
  subContainer,
  loading,
}: AbasContainerProps) => {
  if (loading) return;

  return (
    <Container>
      <Title>{title}</Title>

      {subContainer
        ?.filter(item => item.visible)
        ?.map(content => (
          <>
            {content?.type === 'paragraph' && (
              <Description italic={content?.italic || false}>
                {content.description}
              </Description>
            )}

            {content?.type === 'keys' && (
              <Description italic={content?.italic || false}>
                {content?.subtitle && <strong>{content.subtitle}:</strong>}
                {content.description}
              </Description>
            )}

            {content?.type === 'paragraphIcon' && (
              <InfoSection>
                {content?.icon?.image?.url && (
                  <Icon
                    src={urlBuild(content.icon.image.url)}
                    alt="imagem do container"
                  />
                )}
                <Description italic={content?.italic || false}>
                  {content?.description}
                </Description>
              </InfoSection>
            )}

            {content?.type === 'image' && (
              <ColumnDetails>
                {content?.image?.url && (
                  <Img
                    src={urlBuild(content.image.url)}
                    alt="imagem do container"
                  />
                )}
                <span>
                  <strong>Legenda</strong>: {content?.description || ''}
                </span>
              </ColumnDetails>
            )}

            {content?.type === 'pdf' && (
              <InfoSection>
                {content.pdf?.name && (
                  <ButtonDownload
                    onClick={() => {
                      window.open(urlBuild(content?.pdf?.url), '_blank');
                    }}
                  >
                    <FaDownload color={theme.colors.grayStronger} />
                    {content.pdf?.name}
                  </ButtonDownload>
                )}
              </InfoSection>
            )}
          </>
        ))}
    </Container>
  );
};

export default AbasContainer;
