'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { CaptersDatum, TitlesDatum, ContainerData } from '@/interfaces/manual';
import { IContent } from '@/interfaces/content';
import { Paginated } from '@/interfaces/paginated';

import { getManuals } from '@/services/querys/manual';
import { useEnterprise } from '@/services/querys/enterprise';
import handleError from '@/utils/handleToast';
import { urlBuild } from '@/utils/urlBuild';
import { RecursiveNormalize as R } from '@/utils/normalizeStrapi';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

import PageLayout from '@/components/PageLayout/PageLayout';
import Loading from '@/components/Loading/Loading';
import TableContainer from './components/TableContainer/TableContainer';
import AbasContainer from './components/AbasContainer/AbasContainer';
import ChapterContainer from './components/ChapterContainer/ChapterContainer';
import TitleContainer from './components/TitleContainer/TitleContainer';
import ManualMap from './components/ManualMap/ManualMap';
import Footer from './components/Footer/Footer';

import { Content, Header, Table, Thread, Image, Separator } from './styles';

const PanelPage = () => {
  const { user } = useAuth();

  const [chapterSelected, setChapter] = useState<R<CaptersDatum> | undefined>();
  const [titleSelected, setTitle] = useState<R<TitlesDatum> | undefined>();
  const [sub, setSubContent] = useState<R<ContainerData> | undefined>();
  const [loading, setLoading] = useState(false);

  const manualsParams = {
    'populate[0]': 'capters.titles.containers.image',
    'populate[1]': 'enterprise.company.image',
    'populate[3]': 'capters.icon.image',
    'populate[4]': 'capters.titles.containers.pdf',
    'populate[5]': 'capters.titles.containers.icon.image',
    'populate[6]': 'capters.groups',
    'populate[7]': 'enterprise.image',
    'populate[8]': 'capters.titles.containers.sub_containers.pdf',
    'populate[9]': 'capters.titles.containers.sub_containers.icon.image',
    'populate[10]': 'capters.titles.containers.sub_containers.image',
    'populate[11]': 'capters.titles.containers.sub_containers.sub_containers',
    'filters[capters][groups]': user?.group?.id,
  };

  const { data: manuals, isLoading } = useQuery({
    queryKey: ['manualForm', manualsParams],
    queryFn: async () => {
      const data = await getManuals(manualsParams);
      const results = normalizeStrapi(data || []);
      return results?.[0];
    },
    enabled: !!user?.group?.id,
  });

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
      setSubContent(result?.sub_containers?.[0]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const chaptersist =
    manuals?.capters.filter(capter =>
      capter.groups.find(group => group.id === user?.group?.id),
    ) || [];

  const { data: enterprises, isLoading: enterpriseIsLoading } = useEnterprise(
    {
      populate: 'groups.enterprise',
      'filters[id]': user?.group?.enterprise?.id,
    },
    !!user?.group?.enterprise?.id,
  );

  const enterprise = enterprises?.[0];

  const addressList = [
    enterprise?.address || null,
    enterprise?.number || null,
    enterprise?.neighborhood || null,
    enterprise?.city || null,
    enterprise?.state || null,
    enterprise?.zipCode ? `CEP: ${enterprise?.zipCode}` : null,
    enterprise?.complement || null,
  ];

  const image1 = user?.group?.enterprise?.company?.image?.url;
  const image2 = user?.group?.enterprise?.image?.url;
  const name = user?.group?.enterprise?.title || manuals?.enterprise?.title;

  return (
    <PageLayout hasLogo logo={image1 && urlBuild(image1)}>
      <Header>
        {image2 && <Image src={urlBuild(image2)} alt="Logo" />}
        <div>{name || 'Manual Predial'}</div>
        <div>{addressList?.filter(i => i !== null).join(', ')}</div>
      </Header>

      <Content>
        <Table>
          {chaptersist
            .filter(item => item.visible)
            .sort((a, b) => a.order - b.order)
            .map(chapter => (
              <>
                <ChapterContainer
                  chapter={chapter}
                  selected={chapterSelected}
                  setSubContent={setSubContent}
                  setSelected={setChapter}
                />

                {chapterSelected?.id === chapter.id &&
                  chapter.titles
                    .filter(item => item.visible)
                    .sort((a, b) => a.order - b.order)
                    .map((title, index) => (
                      <>
                        <TitleContainer
                          index={index}
                          getContent={getContent}
                          selected={titleSelected}
                          setSelected={setTitle}
                          setSubContent={setSubContent}
                          title={title}
                        />

                        {titleSelected?.id === title.id &&
                          title.containers
                            .filter(item => item.visible)
                            .sort((a, b) => a.order - b.order)
                            .map((container, i) => (
                              <Thread key={container.id}>
                                <TableContainer
                                  setSubContainer={setSubContent}
                                  subContainer={sub}
                                  loading={loading}
                                  container={container}
                                  hasFirst={i === 0}
                                  hasLast={title?.containers?.length === i + 1}
                                />

                                {sub?.id && container?.type === 'abas' && (
                                  <AbasContainer
                                    title={sub?.subtitle || ''}
                                    subContainer={sub?.sub_containers || []}
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

          {chaptersist && chaptersist?.length > 0 && (
            <ManualMap chapter={chaptersist} />
          )}
        </Table>
      </Content>

      <Footer />

      {isLoading && !enterpriseIsLoading && !loading && <Loading />}
    </PageLayout>
  );
};

export default PanelPage;
