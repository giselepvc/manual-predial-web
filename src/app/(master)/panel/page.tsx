'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { getManuals } from '@/services/querys/manual';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { urlBuild } from '@/utils/urlBuild';
import { useState } from 'react';
import { CaptersDatum, TitlesDatum } from '@/interfaces/manual';
import handleError from '@/utils/handleToast';
import api from '@/services/api';
import { ContainerData, IContent } from '@/interfaces/content';
import { Paginated } from '@/interfaces/paginated';
import { FaDownload } from 'react-icons/fa6';
import {
  ColumnDetails,
  Content,
  Description,
  Icon,
  Img,
  InfoSection,
  InfoText,
  NotListText,
  TableContentMore,
  TableDetails,
  TableMore,
  TableRow,
  TableSection,
  Thread,
  ThreadLine,
  ThreadSection,
} from './styles';

const PanelPage = () => {
  const { user } = useAuth();

  const [chapter, setChapter] = useState<
    RecursiveNormalize<CaptersDatum> | undefined
  >();
  const [title, setTitle] = useState<
    RecursiveNormalize<TitlesDatum> | undefined
  >();
  const [contentSelected, setContentSelected] = useState<
    RecursiveNormalize<IContent> | undefined
  >();
  const [sub, setSubContent] = useState<
    RecursiveNormalize<ContainerData> | undefined
  >();
  const [loading, setLoading] = useState(false);

  const manualsParams = {
    'populate[0]': 'capters.titles.containers.image',
    'populate[1]': 'enterprise',
    'populate[3]': 'capters.icon.image',
    'populate[4]': 'capters.titles.containers.pdf',
    'populate[5]': 'capters.titles.containers.icon.image',
    'populate[6]': 'capters.group',
    'filters[capters][groups][id]': user?.group?.id,
  };

  const { data: manuals } = useQuery({
    queryKey: ['manualForm', manualsParams],
    queryFn: async () => {
      const data = await getManuals(manualsParams);
      const results = normalizeStrapi(data || []);
      const result = results?.[0];
      return result;
    },
    enabled: !!user?.group?.id,
  });

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

  return (
    <PageLayout title="Manuais">
      <Content style={{ minHeight: 'calc(100vh - 10rem)' }}>
        <TableSection>
          {manuals?.capters && manuals.capters.length > 0 ? (
            manuals.capters
              .sort((a, b) => a.order - b.order)
              .map(capter => (
                <>
                  <TableRow
                    key={capter.id}
                    selected={chapter?.id === capter.id}
                    onClick={() => {
                      setChapter(chapter === capter ? undefined : capter);
                      setSubContent(undefined);
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
                          chapter?.id === capter.id
                            ? '/icons/up-arrow.svg'
                            : '/icons/down-arrow.svg'
                        }
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </div>
                  </TableRow>

                  {chapter?.id === capter.id &&
                    capter.titles.map((titles, index) => (
                      <>
                        <Thread
                          onClick={() => {
                            if (titles.containers?.[0]?.type === 'abas') {
                              setSubContent(undefined);
                              getContent(titles.containers?.[0]?.id);
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
                                  style={{ paddingLeft: '3rem' }}
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
                                        <Description>
                                          <div>{sub.title}</div>

                                          {sub.description}
                                        </Description>
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
    </PageLayout>
  );
};

export default PanelPage;
