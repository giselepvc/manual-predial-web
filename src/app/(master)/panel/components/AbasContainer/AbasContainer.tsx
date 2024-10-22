import { FaDownload } from 'react-icons/fa6';

import { ContainerData } from '@/interfaces/manual';

import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';

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
  title: string;
  subContainer: RecursiveNormalize<ContainerData[]> | [];
}

const AbasContainer = ({ title, subContainer }: AbasContainerProps) => {
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
        <Description italic={italic}>{paragrafo || ''}</Description>
      </InfoSection>
    ));
  };

  const renderDescription = (
    text: string,
    italic: boolean,
    subtitle?: string,
  ) => {
    const paragraphs = text?.split('\n');
    return paragraphs?.map(item => (
      <Description italic={italic || false}>
        {subtitle && <strong>{subtitle}:</strong>}
        {item}
      </Description>
    ));
  };

  return (
    <Container>
      <Title>{title}</Title>

      {subContainer
        ?.filter(item => item.visible)
        ?.map(content => (
          <>
            {content?.type === 'paragraph' &&
              renderDescription(content?.description, content?.italic || false)}

            {content?.type === 'keys' &&
              renderDescription(
                content?.description,
                content?.italic || false,
                content?.subtitle,
              )}

            {content?.type === 'paragraphIcon' &&
              renderDescriptionWithIcon(
                content?.description,
                content?.italic || false,
                content?.icon?.image?.url,
              )}

            {content?.type === 'image' && (
              <ColumnDetails>
                {content?.image?.url && (
                  <Img
                    src={urlBuild(content?.image?.url)}
                    alt="imagem do container"
                  />
                )}
                <span>
                  <strong>Legenda</strong>: {content?.description}
                </span>
              </ColumnDetails>
            )}

            {content?.type === 'pdf' && (
              <InfoSection>
                {content?.pdf?.name && (
                  <ButtonDownload
                    onClick={() => {
                      window.open(urlBuild(content?.pdf?.url), '_blank');
                    }}
                  >
                    <FaDownload color={theme.colors.grayStronger} />
                    {content?.pdf?.name}
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
