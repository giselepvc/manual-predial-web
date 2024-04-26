'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { getManuals } from '@/services/querys/manual';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { urlBuild } from '@/utils/urlBuild';
import { useState } from 'react';
import { CaptersDatum, ContentsDatum, TitlesDatum } from '@/interfaces/manual';
import {
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
  const [content, setContent] = useState<
    RecursiveNormalize<ContentsDatum> | undefined
  >();

  const manualsParams = {
    'populate[0]': 'capters.titles.containers.image',
    'populate[1]': 'enterprise',
    'populate[3]': 'capters.icon.image',
    'populate[4]': 'capters.titles.containers.pdf',
    'populate[5]': 'capters.titles.containers.icon.image',
    'populate[6]': 'capters.group',
    'filters[capters][group][id]': user?.group?.id,
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
                    }}
                  >
                    <InfoSection>
                      <span>{capter.order}</span>
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
                        <Thread>
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
                              <span>{index + 1}</span>
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
                                  onClick={() => {
                                    setContent(props =>
                                      props === container
                                        ? undefined
                                        : container,
                                    );
                                  }}
                                >
                                  <TableDetails>
                                    <InfoSection>
                                      <span>{container.order}</span>
                                      <div>
                                        {container.type === 'abas' && 'Abas'}
                                        {container.type === 'keys' &&
                                          'Parágrafo - par de chaves'}
                                        {container.type !== 'abas' &&
                                          container.type !== 'keys' &&
                                          container.title}
                                      </div>
                                    </InfoSection>

                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Image
                                        src={
                                          container?.id === content?.id
                                            ? '/icons/up-arrow.svg'
                                            : '/icons/down-arrow.svg'
                                        }
                                        alt="icon"
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  </TableDetails>
                                </Thread>

                                {container?.id === content?.id && (
                                  <Thread style={{ paddingLeft: '3rem' }}>
                                    <TableContentMore key={container?.id}>
                                      {container.type === 'pdf' &&
                                        container.pdf?.name && (
                                          <InfoSection>
                                            <InfoText>
                                              {container.pdf?.name}
                                            </InfoText>
                                          </InfoSection>
                                        )}

                                      {container.type === 'abas' && (
                                        <InfoSection>
                                          <InfoText>
                                            {container?.icon?.image?.url && (
                                              <Icon
                                                src={urlBuild(
                                                  container?.icon?.image?.url,
                                                )}
                                                alt="imagem do container"
                                              />
                                            )}
                                            {container.title || ''}
                                          </InfoText>
                                        </InfoSection>
                                      )}

                                      {container.type === 'image' &&
                                        container?.image?.[0]?.url && (
                                          <InfoSection>
                                            <Img
                                              src={urlBuild(
                                                container?.image?.[0]?.url,
                                              )}
                                              alt="imagem do container"
                                            />

                                            <Description>
                                              Legenda: {container?.description}
                                            </Description>
                                          </InfoSection>
                                        )}

                                      {container?.type === 'paragraph' && (
                                        <InfoSection>
                                          {container?.icon?.image?.url && (
                                            <Icon
                                              src={urlBuild(
                                                container?.icon?.image?.url,
                                              )}
                                              alt="imagem do container"
                                            />
                                          )}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}

                                      {container?.type === 'paragraphIcon' && (
                                        <InfoSection>
                                          {container?.icon?.image?.url && (
                                            <Icon
                                              src={urlBuild(
                                                container?.icon?.image?.url,
                                              )}
                                              alt="imagem do container"
                                            />
                                          )}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}

                                      {container?.type === 'keys' && (
                                        <InfoSection>
                                          {container?.icon?.image?.url && (
                                            <Icon
                                              src={urlBuild(
                                                container?.icon?.image?.url,
                                              )}
                                              alt="imagem do container"
                                            />
                                          )}
                                          Chave: {container?.title}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}
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
