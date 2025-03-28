import { urlBuild } from '@/utils/urlBuild';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { ContentsDatum, ContainerData } from '@/interfaces/manual';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa6';
import { theme } from '@/styles/theme';
import {
  ButtonDownload,
  ColumnDetails,
  Description,
  Icon,
  IconNavbar,
  Img,
  InfoColumnSection,
  InfoSection,
  InfoText,
  TableDetails,
} from './styles';

interface ContainerProps {
  container: RecursiveNormalize<ContentsDatum> | undefined;
  hasLast?: boolean;
  subContainer: RecursiveNormalize<ContainerData> | undefined;
  setSubContainer: Dispatch<
    SetStateAction<RecursiveNormalize<ContainerData> | undefined>
  >;
}

const ContentList = ({
  container,
  hasLast,
  subContainer,
  setSubContainer,
}: ContainerProps) => {
  const renderDescription = (text: string, italic: boolean, image?: string) => {
    const paragraphs = text.split('\n');
    const length = paragraphs?.length || 0;

    return paragraphs.map((paragrafo, i) => (
      <InfoSection>
        {image && (paragrafo || paragrafo !== '') && (
          <Icon src={urlBuild(image)} alt="imagem do container" />
        )}
        <Description hasLast={hasLast && length === i + 1} italic={italic}>
          {paragrafo}
        </Description>
      </InfoSection>
    ));
  };

  useEffect(() => {
    if (container?.type === 'abas') {
      const subContainers = container?.sub_containers?.[0];
      setSubContainer(subContainers);
    }
  }, []);

  return (
    <TableDetails hasLast={hasLast}>
      <InfoSection>
        {container?.type === 'paragraph' && container?.description && (
          <InfoColumnSection>
            {renderDescription(
              container.description,
              container?.italic || false,
            )}
          </InfoColumnSection>
        )}

        {container?.type === 'keys' && (
          <Description
            hasLast={hasLast}
            italic={container?.italic || false}
            style={{ flexDirection: 'row', gap: '0.2rem' }}
          >
            {container.subtitle && <strong>{container.subtitle}:</strong>}
            {container.description}
          </Description>
        )}

        {container?.type === 'paragraphIcon' && (
          <InfoSection>
            <InfoColumnSection>
              {renderDescription(
                container.description,
                container?.italic || false,
                container?.icon?.image?.url,
              )}
            </InfoColumnSection>
          </InfoSection>
        )}

        {container?.type === 'image' && (
          <ColumnDetails>
            {container?.image?.url && (
              <Img
                src={urlBuild(container.image.url)}
                alt="imagem do container"
              />
            )}
            <span>
              <strong>Legenda</strong>: {container?.description || ''}
            </span>
          </ColumnDetails>
        )}

        {container?.type === 'pdf' && (
          <InfoSection>
            {container.pdf?.name && (
              <ButtonDownload
                onClick={() => {
                  window.open(urlBuild(container?.pdf?.url), '_blank');
                }}
              >
                <FaDownload color={theme.colors.grayStronger} />
                {container.pdf?.name}
              </ButtonDownload>
            )}
          </InfoSection>
        )}

        {container?.type === 'abas' && container?.sub_containers && (
          <InfoSection style={{ borderBottom: '1px solid #AAAAAA' }}>
            {container?.sub_containers
              ?.filter(item => item.visible)
              ?.sort((a, b) => a.order - b.order)
              ?.map(subcontainer => (
                <InfoText
                  selected={subcontainer?.id === subContainer?.id}
                  onClick={() => {
                    setSubContainer(subItem =>
                      subItem === subcontainer ? undefined : subcontainer,
                    );
                  }}
                >
                  {subcontainer?.icon?.image?.url && (
                    <IconNavbar
                      src={urlBuild(subcontainer.icon.image.url)}
                      alt="imagem do container"
                    />
                  )}
                  {subcontainer.title || ''}
                </InfoText>
              ))}
          </InfoSection>
        )}
      </InfoSection>
    </TableDetails>
  );
};

export default ContentList;
