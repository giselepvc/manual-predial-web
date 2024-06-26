import { urlBuild } from '@/utils/urlBuild';
import { IContent } from '@/interfaces/content';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { FaPen, FaTrash } from 'react-icons/fa6';
import { Dispatch, SetStateAction } from 'react';
import { ContentsDatum } from '@/interfaces/manual';
import { Content, InfoSection, TableRow, TableSection, Image } from './styles';

interface ContentProps {
  container: RecursiveNormalize<IContent> | undefined;
  setDeletingId: Dispatch<SetStateAction<number | undefined>>;
  setContent: Dispatch<
    SetStateAction<RecursiveNormalize<ContentsDatum> | undefined>
  >;
  setBuildType: Dispatch<SetStateAction<string>>;
  setSteps: Dispatch<SetStateAction<number>>;
}

const ContentList = ({
  container,
  setDeletingId,
  setContent,
  setBuildType,
  setSteps,
}: ContentProps) => {
  const name = {
    pdf: 'Arquivo PDF',
    image: 'Imagem única com legenda abaixo parágrafo múltiplo',
    paragraph: 'Parágrafo único ou múltiplo',
    paragraphIcon: 'Parágrafos - tópicos com ícones',
  } as any;

  return (
    <Content>
      <TableSection>
        {container?.sub_containers
          ?.sort((a, b) => a.order - b.order)
          ?.map(content => (
            <TableRow>
              <InfoSection>
                <span>{content.order}</span>

                {content.icon?.image?.url && (
                  <Image src={urlBuild(content.icon?.image?.url)} alt="icon" />
                )}

                <div>{name[content.type || 'paragraph']}</div>
              </InfoSection>

              <div>
                {!content?.visible && 'ocultado'}

                <FaPen
                  onClick={() => {
                    setContent(content);
                    setSteps(5);
                    setBuildType(content.type);
                  }}
                />

                <FaTrash onClick={() => setDeletingId(content.id)} />
              </div>
            </TableRow>
          ))}
      </TableSection>
    </Content>
  );
};

export default ContentList;
