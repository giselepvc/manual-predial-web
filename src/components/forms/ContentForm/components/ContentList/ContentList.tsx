import Image from 'next/image';
import { urlBuild } from '@/utils/urlBuild';
import { IContent } from '@/interfaces/content';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { FaPen, FaTrash } from 'react-icons/fa6';
import { Dispatch, SetStateAction } from 'react';
import { ContentsDatum } from '@/interfaces/manual';
import Button from '@/components/Button/Button';
import { UseFormReset } from 'react-hook-form';
import { IContentForm } from '@/validations/ContentSchema';
import {
  Action,
  Content,
  Header,
  InfoSection,
  TableRow,
  TableSection,
} from './styles';

interface ContentProps {
  container: Recursive<IContent> | undefined;
  setDeletingId: Dispatch<SetStateAction<number | undefined>>;
  setContent: Dispatch<SetStateAction<Recursive<ContentsDatum> | undefined>>;
  setBuildType: Dispatch<SetStateAction<string>>;
  setSteps: Dispatch<SetStateAction<number>>;
  setSubContent: Dispatch<SetStateAction<Recursive<ContentsDatum> | undefined>>;
  setAbaContent: Dispatch<SetStateAction<Recursive<IContent> | undefined>>;
  reset: UseFormReset<IContentForm>;
  setContentId: Dispatch<SetStateAction<number | undefined>>;
}

const ContentList = ({
  setSubContent,
  setAbaContent,
  container,
  setDeletingId,
  setContent,
  setBuildType,
  setSteps,
  setContentId,
  reset,
}: ContentProps) => {
  return (
    <Content>
      <TableSection>
        <Header>
          <div>Título</div>
          <div>Legenda</div>
          <div className="last">Ações</div>
        </Header>

        {container?.sub_containers
          ?.sort((a, b) => a.order - b.order)
          ?.map(content => (
            <TableRow>
              <InfoSection>
                <span>{content.order}</span>
                {content.icon?.image?.url && (
                  <Image
                    src={urlBuild(content.icon?.image?.url)}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                )}
                <div>{content.title}</div>
              </InfoSection>

              <div>{content.subtitle}</div>

              <Action>
                {!content?.visible && 'ocultado'}
                <Button
                  type="button"
                  text="Adicionar conteúdo"
                  style={{ minHeight: '25px' }}
                  onClick={() => {
                    setContent(content);
                    setSubContent(content);
                    setAbaContent(container);
                    setSteps(5);
                    setBuildType('subcontainer');
                  }}
                />
                <FaPen
                  onClick={() => {
                    setContentId(content?.id);
                    reset({
                      order: content?.order?.toString() || '',
                      visible: {
                        label: content?.visible ? 'Sim' : 'Não',
                        value: content?.visible ? 'sim' : 'nao',
                      },
                      description: content?.subtitle || '',
                      title: content?.title || '',
                      icon: content?.icon?.id || 0,
                    });
                  }}
                />
                <FaTrash onClick={() => setDeletingId(content.id)} />
              </Action>
            </TableRow>
          ))}
      </TableSection>
    </Content>
  );
};

export default ContentList;
