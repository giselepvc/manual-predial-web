import { UseFormWatch } from 'react-hook-form';
import { CaptersDatum } from '@/interfaces/manual';
import { IManualList, TitlesDatum } from '@/interfaces/manual';
import { Dispatch, SetStateAction, useState } from 'react';
import { IManualForm } from '@/validations/ManualSchema';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { ContainerData, IContent } from '@/interfaces/content';
import { Paginated } from '@/interfaces/paginated';
import api from '@/services/api';
import handleError from '@/utils/handleToast';
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

type IFilters = { visible: boolean; order: number };

const ManualDetails = ({
  watch,
  setCap,
  setTitle,
  cap,
  title,
  manual,
}: ManualTableProps) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Recursive<IContent> | undefined>();
  const [sub, setSubContent] = useState<Recursive<ContainerData> | undefined>();

  const getContent = async (id: number) => {
    try {
      setLoading(true);
      const { data } = await api.get<Paginated<IContent>>('/containers', {
        params: {
          'filters[id]': id,
          'populate[0]': 'sub_containers.pdf',
          'populate[1]': 'sub_containers.icon.image',
          'populate[3]': 'container',
          'populate[4]': 'sub_containers.image',
          'populate[5]': 'icon.image',
          'populate[6]': 'pdf',
          'populate[7]': 'image',
          'populate[8]': 'sub_containers.sub_containers.pdf',
          'populate[9]': 'sub_containers.sub_containers.icon.image',
          'populate[10]': 'sub_containers.sub_containers.image',
        },
      });

      const result = normalizeStrapi(data.data?.[0]);
      setSelected(result);
      setSubContent(result?.sub_containers?.[0]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = <T extends IFilters>(list: T[]): T[] =>
    list.filter(item => item.visible).sort((a, b) => a.order - b.order);

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
                          getContent={getContent}
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
                                  contentSelected={selected}
                                  setSubContainer={setSubContent}
                                  subContainer={sub}
                                  loading={loading}
                                  container={container}
                                  hasLast={titles?.containers?.length === i + 1}
                                />

                                {sub?.id && container?.type === 'abas' && (
                                  <AbasContentList
                                    title={sub?.subtitle || ''}
                                    subContainer={sub.sub_containers || []}
                                    loading={loading}
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
