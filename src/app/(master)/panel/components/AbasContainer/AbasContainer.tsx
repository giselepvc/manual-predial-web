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
} from './styles';

interface AbasContainerProps {
  container: RecursiveNormalize<ContentsDatum> | undefined;
  loading?: boolean;
  subContainer: RecursiveNormalize<ContainerData> | undefined;
}

const AbasContainer = ({
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
    <>
      {subContainer?.type === 'paragraph' && (
        <Description>{subContainer.description}</Description>
      )}

      {subContainer?.type === 'keys' && (
        <Description>
          {subContainer?.subtitle && <strong>{subContainer.subtitle}:</strong>}
          {subContainer.description}
        </Description>
      )}

      {subContainer?.type === 'paragraphIcon' && (
        <InfoSection>
          {subContainer?.icon?.image?.url && (
            <Icon
              src={urlBuild(subContainer.icon.image.url)}
              alt="imagem do container"
            />
          )}
          <Description>{subContainer?.description}</Description>
        </InfoSection>
      )}

      {subContainer?.type === 'image' && (
        <ColumnDetails>
          {subContainer?.image?.[0]?.url && (
            <Img
              src={urlBuild(subContainer.image?.[0].url)}
              alt="imagem do container"
            />
          )}
          <span>
            <strong>Legenda</strong>: {subContainer?.description || ''}
          </span>
        </ColumnDetails>
      )}

      {subContainer?.type === 'pdf' && (
        <InfoSection>
          {subContainer.pdf?.name && (
            <ButtonDownload
              onClick={() => {
                window.open(urlBuild(subContainer?.pdf?.url), '_blank');
              }}
            >
              <FaDownload color={theme.colors.grayStronger} />
              {subContainer.pdf?.name}
            </ButtonDownload>
          )}
        </InfoSection>
      )}
    </>
  );
};

export default AbasContainer;
