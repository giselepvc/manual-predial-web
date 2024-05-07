import { Control, Controller, UseFormWatch } from 'react-hook-form';
import Image from 'next/image';
import {
  CaptersDatum,
  ContentsDatum,
  IManualList,
  TitlesDatum,
} from '@/interfaces/manual';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IManualForm } from '@/validations/ManualSchema';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import { useAuth } from '@/hooks/useAuth';
import { ContainerData, IContent } from '@/interfaces/content';
import { Paginated } from '@/interfaces/paginated';
import api from '@/services/api';
import handleError from '@/utils/handleToast';
import { FaDownload } from 'react-icons/fa6';
import Select from '../Select/Select';
import {
  Field,
  FormSection,
  Header,
  InfoSection,
  Label,
  NotListText,
  RegisterTitle,
  StepsPage,
  TableDetails,
  TableMore,
  TableRow,
  TableSection,
  ThreadSection,
  Thread,
  ThreadLine,
  Content,
  InfoText,
  TableContentMore,
  Img,
  Description,
  Icon,
  ColumnDetails,
} from './styles';

export const typeList = [
  {
    label: 'Capítulo',
    value: 'capitulo',
  },
];

interface ManualTableProps {
  control: Control<IManualForm, any>;
  watch: UseFormWatch<IManualForm>;
  cap: RecursiveNormalize<CaptersDatum> | undefined;
  title: RecursiveNormalize<TitlesDatum> | undefined;
  manual: RecursiveNormalize<IManualList> | undefined;
  content: RecursiveNormalize<ContentsDatum> | undefined;
  setCap: Dispatch<
    SetStateAction<RecursiveNormalize<CaptersDatum> | undefined>
  >;
  setTitle: Dispatch<
    SetStateAction<RecursiveNormalize<TitlesDatum> | undefined>
  >;
}

const ManualDetails = ({
  control,
  watch,
  cap,
  title,
  manual,
  content,
  setCap,
  setTitle,
}: ManualTableProps) => {
  const { role } = useAuth();
  const isCompany = role === 1;
  const [listOtions, setListOptions] = useState(typeList);
  const [loading, setLoading] = useState(false);
  const [contentSelected, setContentSelected] = useState<
    RecursiveNormalize<IContent> | undefined
  >();
  const [sub, setSubContent] = useState<
    RecursiveNormalize<ContainerData> | undefined
  >();

  const getContent = async (id: number) => {
    try {
      setLoading(true);
      const { data } = await api.get<Paginated<IContent>>('/containers', {
        params: {
          'pagination[page]': 1,
          'pagination[pageSize]': 1,
          'filters[id]': id,
          populate: [
            'sub_containers.pdf',
            'sub_containers.icon.image',
            'container',
            'sub_containers.image',
            'icon.image',
            'pdf',
            'image',
          ],
        },
      });

      const result = normalizeStrapi(data.data?.[0]);

      setContentSelected(result);
      setSubContent(result?.sub_containers?.[0]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (manual?.capters && manual?.capters.length > 0) {
      const list = [
        ...typeList,
        {
          label: 'Título',
          value: 'titulo',
        },
        {
          label: 'Container',
          value: 'container',
        },
      ];

      setListOptions(list);
    }
  }, [manual]);

  console.log(sub);

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

      {!isCompany && (
        <FormSection>
          <Field>
            <Label>Tipo de cadastro</Label>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Selecione uma opção"
                  onChange={onChange}
                  value={value}
                  options={listOtions}
                />
              )}
            />
          </Field>
        </FormSection>
      )}

      <Content style={{ minHeight: 'calc(100vh - 14rem)' }}>
        <TableSection>
          {manual?.capters && manual.capters.length > 0 ? (
            manual.capters
              .sort((a, b) => a.order - b.order)
              .map(capter => (
                <>
                  <TableRow
                    key={capter.id}
                    selected={cap?.id === capter.id}
                    onClick={() => {
                      setCap(props => (props === capter ? undefined : capter));
                    }}
                  >
                    <InfoSection>
                      <Image
                        src={
                          capter.icon?.image?.url
                            ? urlBuild(capter.icon?.image?.url)
                            : '/icons/image.svg'
                        }
                        alt="icon"
                        width={20}
                        height={20}
                      />
                      <div>{capter.title}</div>
                    </InfoSection>

                    <div>
                      <Image
                        src={
                          cap?.id === capter.id
                            ? '/icons/up-arrow.svg'
                            : '/icons/down-arrow.svg'
                        }
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </div>
                  </TableRow>

                  {cap?.id === capter.id &&
                    capter.titles.map((titles, index) => (
                      <>
                        <Thread
                          onClick={() => {
                            if (titles.containers?.[0]?.type === 'abas') {
                              setSubContent(undefined);
                              getContent(
                                content?.id || titles.containers?.[0]?.id,
                              );
                            }
                          }}
                        >
                          <ThreadSection>
                            {index + 1 === 1 && <ThreadLine />}
                          </ThreadSection>
                          <TableMore
                            key={titles.id}
                            onClick={() =>
                              setTitle(props =>
                                props === titles ? undefined : titles,
                              )
                            }
                          >
                            <InfoSection>
                              <div>{titles.title}</div>
                            </InfoSection>
                            <div>
                              <Image
                                src={
                                  title?.id === titles.id
                                    ? '/icons/up-arrow.svg'
                                    : '/icons/down-arrow.svg'
                                }
                                alt="icon"
                                width={20}
                                height={20}
                              />
                            </div>
                          </TableMore>
                        </Thread>

                        {title?.id === titles.id &&
                          titles.containers
                            .sort((a, b) => a.order - b.order)
                            .map(container => (
                              <>
                                <Thread
                                  key={container.id}
                                  style={{ paddingLeft: '3.1rem' }}
                                >
                                  <TableDetails>
                                    <InfoSection>
                                      <div>
                                        {container.type === 'keys' &&
                                          'Parágrafo - par de chaves'}

                                        {container.type === 'paragraph' && (
                                          <Description
                                            style={{ margin: '1rem 0' }}
                                          >
                                            {container.description}
                                          </Description>
                                        )}

                                        {container.type === 'pdf' && (
                                          <InfoSection>
                                            {container.pdf?.name && (
                                              <InfoText
                                                style={{
                                                  borderRadius: '10px',
                                                  gap: '1rem',
                                                  cursor: 'pointer',
                                                  padding: '0 2rem',
                                                }}
                                                onClick={() => {
                                                  window.open(
                                                    urlBuild(
                                                      container?.pdf?.url,
                                                    ),
                                                    '_blank',
                                                  );
                                                }}
                                              >
                                                <FaDownload />
                                                {container.pdf?.name}
                                              </InfoText>
                                            )}
                                          </InfoSection>
                                        )}

                                        {container.type === 'image' && (
                                          <ColumnDetails
                                            style={{ padding: '2rem 0' }}
                                          >
                                            {container?.image?.[0]?.url && (
                                              <Img
                                                src={urlBuild(
                                                  container.image?.[0].url,
                                                )}
                                                alt="imagem do container"
                                              />
                                            )}
                                            <span>
                                              Legenda:{' '}
                                              {container?.description || ''}
                                            </span>
                                          </ColumnDetails>
                                        )}

                                        {container.type === 'paragraphIcon' && (
                                          <InfoSection
                                            style={{
                                              margin: '1rem 0',
                                              gap: '1rem',
                                            }}
                                          >
                                            {container?.icon?.image?.url && (
                                              <Icon
                                                src={urlBuild(
                                                  container.icon.image.url,
                                                )}
                                                alt="imagem do container"
                                              />
                                            )}
                                            {container?.description}
                                          </InfoSection>
                                        )}
                                      </div>

                                      {container.type.includes('abas') &&
                                        !loading &&
                                        contentSelected?.sub_containers && (
                                          <InfoSection>
                                            {contentSelected?.sub_containers?.map(
                                              subcontainer => (
                                                <InfoText
                                                  selected={
                                                    subcontainer?.id === sub?.id
                                                  }
                                                  onClick={() => {
                                                    setSubContent(c =>
                                                      c === subcontainer
                                                        ? undefined
                                                        : subcontainer,
                                                    );
                                                  }}
                                                >
                                                  {subcontainer.title || ''}
                                                </InfoText>
                                              ),
                                            )}
                                          </InfoSection>
                                        )}
                                    </InfoSection>
                                  </TableDetails>
                                </Thread>

                                {container.type === 'abas' &&
                                  sub?.id &&
                                  sub?.type === 'paragraph' &&
                                  !loading && (
                                    <Thread style={{ paddingLeft: '3rem' }}>
                                      <TableContentMore key={sub?.id}>
                                        {sub?.icon?.image?.url && (
                                          <Icon
                                            src={urlBuild(sub.icon.image.url)}
                                            alt="imagem do container"
                                          />
                                        )}
                                        <Description
                                          dangerouslySetInnerHTML={{
                                            __html: sub.description,
                                          }}
                                        />
                                      </TableContentMore>
                                    </Thread>
                                  )}

                                {container.type === 'abas' &&
                                  sub?.id &&
                                  sub?.type === 'image' &&
                                  !loading && (
                                    <Thread style={{ paddingLeft: '3rem' }}>
                                      <TableContentMore key={container?.id}>
                                        <ColumnDetails>
                                          {sub?.image?.[0]?.url && (
                                            <Img
                                              src={urlBuild(sub.image?.[0].url)}
                                              alt="imagem do container"
                                            />
                                          )}
                                          <span>
                                            Legenda: {sub?.description || ''}
                                          </span>
                                        </ColumnDetails>
                                      </TableContentMore>
                                    </Thread>
                                  )}

                                {container.type === 'abas' &&
                                  sub?.id &&
                                  sub?.type === 'pdf' &&
                                  !loading && (
                                    <Thread style={{ paddingLeft: '3.1rem' }}>
                                      <TableContentMore key={container?.id}>
                                        <InfoSection>
                                          {sub.pdf?.name && (
                                            <InfoText
                                              style={{
                                                borderRadius: '10px',
                                                gap: '1rem',
                                                cursor: 'pointer',
                                                padding: '0 2rem',
                                              }}
                                              onClick={() => {
                                                window.open(
                                                  urlBuild(sub?.pdf?.url),
                                                  '_blank',
                                                );
                                              }}
                                            >
                                              <FaDownload />
                                              {sub.pdf?.name}
                                            </InfoText>
                                          )}
                                        </InfoSection>
                                      </TableContentMore>
                                    </Thread>
                                  )}

                                {container.type === 'abas' &&
                                  sub?.id &&
                                  sub?.type === 'paragraphIcon' &&
                                  !loading && (
                                    <Thread style={{ paddingLeft: '3rem' }}>
                                      <TableContentMore key={container?.id}>
                                        <InfoSection>
                                          {sub?.icon?.image?.url && (
                                            <Icon
                                              src={urlBuild(sub.icon.image.url)}
                                              alt="imagem do container"
                                            />
                                          )}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      </TableContentMore>
                                    </Thread>
                                  )}
                              </>
                            ))}

                        <div style={{ marginBottom: '1rem' }} />
                      </>
                    ))}
                </>
              ))
          ) : (
            <NotListText>Não há capitulos cadastrados!</NotListText>
          )}
        </TableSection>
      </Content>
    </StepsPage>
  );
};

export default ManualDetails;
