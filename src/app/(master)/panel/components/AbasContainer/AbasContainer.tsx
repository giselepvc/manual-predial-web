import { ContainerData } from '@/interfaces/content';
import { ContentsDatum } from '@/interfaces/manual';
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
  container: RecursiveNormalize<ContentsDatum> | undefined;
  loading?: boolean;
  subContainer: RecursiveNormalize<ContainerData[]> | [];
  title: string;
}

const AbasContainer = ({
  title,
  container,
  subContainer,
  loading,
}: AbasContainerProps) => {
  console.log({
    container,
    sub: subContainer,
  });

  if (loading) return;

  return (
    <Container>
      <Title>{title}</Title>

      {subContainer?.map(content => (
        <>
          {content?.type === 'paragraph' && (
            <Description>{content.description}</Description>
          )}

          {content?.type === 'keys' && (
            <Description>
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
              <Description>{content?.description}</Description>
            </InfoSection>
          )}

          {content?.type === 'image' && (
            <ColumnDetails>
              {content?.image?.[0]?.url && (
                <Img
                  src={urlBuild(content.image?.[0].url)}
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
