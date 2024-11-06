import { Dispatch, SetStateAction, useState } from 'react';
import { UseFormWatch } from 'react-hook-form';

import { CaptersDatum } from '@/interfaces/manual';
import { IManualList, TitlesDatum } from '@/interfaces/manual';
import { IManualForm } from '@/validations/ManualSchema';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { ContainerData } from '@/interfaces/manual';

import ChapterList from './components/ChapterList/ChapterList';
import TitlesList from './components/TitlesList/TitlesList';
import ContentList from './components/ContentList/ContentList';
import AbasContentList from './components/AbasContentList/AbasContentList';

import {
  Header,
  RegisterTitle,
  StepsPage,
  TableSection,
  Thread,
  Content,
  Separator,
} from './styles';

interface ManualTableProps {
  watch: UseFormWatch<IManualForm>;
  cap: Recursive<CaptersDatum> | undefined;
  title: Recursive<TitlesDatum> | undefined;
  manual: Recursive<IManualList> | undefined;
  setCap: Dispatch<SetStateAction<Recursive<CaptersDatum> | undefined>>;
  setTitle: Dispatch<SetStateAction<Recursive<TitlesDatum> | undefined>>;
}

const ManualDetails = ({
  watch,
  setCap,
  setTitle,
  cap,
  title,
  manual,
}: ManualTableProps) => {
  const [sub, setSubContent] = useState<Recursive<ContainerData> | undefined>();

  return (
    <StepsPage>
      <Header>
        <RegisterTitle>
          Empreendimento: <span>{watch('enterprise.label')}</span>
        </RegisterTitle>
        <RegisterTitle>
          Nome do manual: <span>{watch('name')}</span>
        </RegisterTitle>
      </Header>

      <Content>
        <TableSection>
          {manual?.capters
            ?.filter(item => item.visible)
            ?.sort((a, b) => a.order - b.order)
            ?.map(capter => (
              <>
                <ChapterList
                  chapter={capter}
                  selected={cap}
                  setSubContent={setSubContent}
                  setSelected={setCap}
                />

                {cap?.id === capter.id &&
                  capter.titles
                    .filter(item => item.visible)
                    .sort((a, b) => a.order - b.order)
                    .map((titles, index) => (
                      <>
                        <TitlesList
                          index={index}
                          selected={title}
                          setSelected={setTitle}
                          setSubContent={setSubContent}
                          title={titles}
                        />

                        {title?.id === titles.id &&
                          titles.containers
                            ?.filter(item => item.visible)
                            .sort((a, b) => a.order - b.order)
                            .map((container, i) => (
                              <Thread key={container.id}>
                                <ContentList
                                  setSubContainer={setSubContent}
                                  subContainer={sub}
                                  container={container}
                                  hasLast={titles?.containers?.length === i + 1}
                                />

                                {sub?.id && container?.type === 'abas' && (
                                  <AbasContentList
                                    title={sub?.subtitle || ''}
                                    subContainer={sub.sub_containers || []}
                                  />
                                )}
                              </Thread>
                            ))}
                        <Separator />
                      </>
                    ))}
              </>
            ))}
        </TableSection>
      </Content>
    </StepsPage>
  );
};

export default ManualDetails;
