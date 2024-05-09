'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { getManuals } from '@/services/querys/manual';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import { urlBuild } from '@/utils/urlBuild';
import { useState } from 'react';
import { CaptersDatum, TitlesDatum } from '@/interfaces/manual';
import handleError from '@/utils/handleToast';
import api from '@/services/api';
import { ContainerData, IContent } from '@/interfaces/content';
import { Paginated } from '@/interfaces/paginated';
import { FaDownload } from 'react-icons/fa6';
import TableContainer from './TableContainer/TableContainer';
import {
  ColumnDetails,
  Content,
  Description,
  HeaderLogo,
  Icon,
  Img,
  InfoSection,
  InfoText,
  NotListText,
  TableContentMore,
  TableMore,
  TableRow,
  TableSection,
  Thread,
  ThreadLine,
  ThreadSection,
  IconArrow,
  Image,
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
    'populate[1]': 'enterprise.company.image',
    'populate[3]': 'capters.icon.image',
    'populate[4]': 'capters.titles.containers.pdf',
    'populate[5]': 'capters.titles.containers.icon.image',
    'populate[6]': 'capters.group',
    'populate[7]': 'enterprise.image',
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

  const addressList = [
    manuals?.enterprise?.address || null,
    manuals?.enterprise?.city || null,
    manuals?.enterprise?.number || null,
    manuals?.enterprise?.state || null,
    manuals?.enterprise?.zipCode || null,
  ];

  const renderImage = () => {
    if (manuals?.enterprise?.company?.image?.url) {
      return urlBuild(manuals.enterprise.company.image.url);
    }

    if (manuals?.enterprise?.image?.url) {
      return urlBuild(manuals.enterprise.image.url);
    }

    return '/img/logo_dark.svg';
  };

  return (
    <PageLayout hasLogo>
      <HeaderLogo>
        <Image src={renderImage()} alt="Logo" />
        <div>{manuals?.enterprise?.company?.name || 'MANUAL PREDIAL'}</div>
        <div>{addressList?.join(', ')}</div>
      </HeaderLogo>

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
                      <IconArrow
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
                      <IconArrow
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
                            selected={title?.id === titles.id}
                            onClick={() =>
                              setTitle(props =>
                                props === titles ? undefined : titles,
                              )
                            }
                          >
                            <InfoSection>
                              <div>{titles.title.toUpperCase()}</div>
                            </InfoSection>
                            <IconArrow
                              src={
                                title?.id === titles.id
                                  ? '/icons/up-arrow.svg'
                                  : '/icons/down-arrow.svg'
                              }
                              alt="icon"
                            />
                          </TableMore>
                        </Thread>

                        {title?.id === titles.id &&
                          titles.containers
                            .sort((a, b) => a.order - b.order)
                            .map((container, idxContainer) => (
                              <>
                                <Thread
                                  key={container.id}
                                  style={{ paddingLeft: '3rem' }}
                                >
                                  <TableContainer
                                    contentSelected={contentSelected}
                                    setSubContainer={setSubContent}
                                    subContainer={sub}
                                    loading={loading}
                                    container={container}
                                    hasLast={
                                      titles?.containers?.length ===
                                      idxContainer + 1
                                    }
                                  />
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
