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

const AbasContentList = ({
  title,
  subContainer,
  loading,
}: AbasContainerProps) => {
  if (loading) return;

  const renderDescriptionWithIcon = (
    text: string,
    italic: boolean,
    image?: string,
  ) => {
    const paragraphs = text?.split('\n');
    return paragraphs?.map(paragrafo => (
      <InfoSection>
        {image && (paragrafo || paragrafo !== '') && (
          <Icon src={urlBuild(image)} alt="imagem do container" />
        )}
        <Description italic={italic}>{paragrafo}</Description>
      </InfoSection>
    ));
  };

  const renderDescription = (text: string) => {
    return text?.split('\n');
  };

  return (
    <Container>
      <Title>{title}</Title>

      {subContainer
        ?.filter(item => item.visible)
        ?.map(content => (
          <>
            {content?.type === 'paragraph' && (
              <Description italic={content?.italic || false}>
                {renderDescription(content?.description)?.map(
                  item => item || '',
                )}
              </Description>
            )}

            {content?.type === 'keys' && (
              <Description italic={content?.italic || false}>
                {content?.subtitle && <strong>{content.subtitle}:</strong>}
                {renderDescription(content?.description)?.map(
                  item => item || '',
                )}
              </Description>
            )}

            {content?.type === 'paragraphIcon' &&
              renderDescriptionWithIcon(
                content?.description,
                content?.italic || false,
                content.icon.image.url,
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
                  <strong>Legenda</strong>:{' '}
                  {renderDescription(content?.description)?.map(
                    item => item || '',
                  )}
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

export default AbasContentList;
