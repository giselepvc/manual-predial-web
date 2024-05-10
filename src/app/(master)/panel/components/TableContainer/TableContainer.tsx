import { urlBuild } from '@/utils/urlBuild';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { ContentsDatum } from '@/interfaces/manual';
import { ContainerData, IContent } from '@/interfaces/content';
import { Dispatch, SetStateAction } from 'react';
import { FaDownload } from 'react-icons/fa6';
import { theme } from '@/styles/theme';
import {
  ButtonDownload,
  ColumnDetails,
  Description,
  Icon,
  IconNavbar,
  Img,
  InfoSection,
  InfoText,
  TableDetails,
} from './styles';

interface ContainerProps {
  container: RecursiveNormalize<ContentsDatum> | undefined;
  hasLast?: boolean;
  loading?: boolean;
  contentSelected: RecursiveNormalize<IContent> | undefined;
  subContainer: RecursiveNormalize<ContainerData> | undefined;
  setSubContainer: Dispatch<
    SetStateAction<RecursiveNormalize<ContainerData> | undefined>
  >;
}

const TableContainer = ({
  container,
  hasLast,
  loading,
  contentSelected,
  subContainer,
  setSubContainer,
}: ContainerProps) => {
  return (
    <TableDetails hasLast={hasLast}>
      <InfoSection>
        {container?.type === 'paragraph' && (
          <Description hasLast={hasLast} italic={container?.italic || false}>
            {container.description}
          </Description>
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
            {container?.icon?.image?.url && (
              <Icon
                src={urlBuild(container.icon.image.url)}
                alt="imagem do container"
              />
            )}
            <Description hasLast={hasLast} italic={container?.italic || false}>
              {container.description}
            </Description>
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

        {container?.type === 'abas' &&
          !loading &&
          contentSelected?.sub_containers && (
            <InfoSection style={{ borderBottom: '1px solid #AAAAAA' }}>
              {contentSelected?.sub_containers?.map(subcontainer => (
                <InfoText
                  selected={subcontainer?.id === subContainer?.id}
                  onClick={() => {
                    setSubContainer(c =>
                      c === subcontainer ? undefined : subcontainer,
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

export default TableContainer;
