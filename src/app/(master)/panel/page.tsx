'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { getManuals } from '@/services/querys/manual';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import { urlBuild } from '@/utils/urlBuild';
import { useState } from 'react';
import { CaptersDatum, TitlesDatum } from '@/interfaces/manual';
import handleError from '@/utils/handleToast';
import api from '@/services/api';
import { ContainerData, IContent } from '@/interfaces/content';
import { Paginated } from '@/interfaces/paginated';
import TableContainer from './components/TableContainer/TableContainer';
import AbasContainer from './components/AbasContainer/AbasContainer';
import ChapterContainer from './components/ChapterContainer/ChapterContainer';
import TitleContainer from './components/TitleContainer/TitleContainer';
import {
  Content,
  Header,
  Table,
  Thread,
  Image,
  Separator,
  LogoImage,
} from './styles';
import ManualMap from './components/ManualMap/ManualMap';

const PanelPage = () => {
  const { user } = useAuth();

  const [chapter, setChapter] = useState<Recursive<CaptersDatum> | undefined>();
  const [title, setTitle] = useState<Recursive<TitlesDatum> | undefined>();
  const [selected, setSelected] = useState<Recursive<IContent> | undefined>();
  const [sub, setSubContent] = useState<Recursive<ContainerData> | undefined>();
  const [loading, setLoading] = useState(false);

  const manualsParams = {
    'populate[0]': 'capters.titles.containers.image',
    'populate[1]': 'enterprise.company.image',
    'populate[3]': 'capters.icon.image',
    'populate[4]': 'capters.titles.containers.pdf',
    'populate[5]': 'capters.titles.containers.icon.image',
    'populate[6]': 'capters.groups',
    'populate[7]': 'enterprise.image',
    'populate[8]': 'sub_containers.sub_containers.pdf',
    'populate[9]': 'sub_containers.sub_containers.icon.image',
    'populate[10]': 'sub_containers.sub_containers.image',
    'filters[capters][groups]': user?.group?.id,
  };

  const { data: manuals } = useQuery({
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
      setSelected(result);
      setSubContent(result?.sub_containers?.[0]);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const chapters =
    manuals?.capters.filter(capter =>
      capter.groups.find(group => group.id === user?.group?.id),
    ) || [];

  const addressList = [
    manuals?.enterprise?.address || null,
    manuals?.enterprise?.number || null,
    manuals?.enterprise?.city || null,
    manuals?.enterprise?.state || null,
    manuals?.enterprise?.zipCode || null,
  ];

  const image1 = manuals?.enterprise?.company?.image?.url;
  const image2 = manuals?.enterprise?.image?.url;

  return (
    <PageLayout hasLogo logo={image1 && urlBuild(image1)}>
      <Header>
        {image2 && <Image src={urlBuild(image2)} alt="Logo" />}
        <div>{manuals?.enterprise?.title || 'Manual Predial'}</div>
        <div>{addressList?.filter(i => i).join(', ')}</div>
      </Header>

      <Content>
        <Table>
          {chapters
            .filter(item => item.visible)
            .sort((a, b) => a.order - b.order)
            .map(chap => (
              <>
                <ChapterContainer
                  chapter={chap}
                  selected={chapter}
                  setSubContent={setSubContent}
                  setSelected={setChapter}
                />

                {chapter?.id === chap.id &&
                  chap.titles
                    .filter(item => item.visible)
                    .sort((a, b) => a.order - b.order)
                    .map((ttl, index) => (
                      <>
                        <TitleContainer
                          index={index}
                          getContent={getContent}
                          selected={title}
                          setSelected={setTitle}
                          setSubContent={setSubContent}
                          title={ttl}
                        />

                        {title?.id === ttl.id &&
                          ttl.containers
                            .filter(item => item.visible)
                            .sort((a, b) => a.order - b.order)
                            .map((container, i) => (
                              <Thread key={container.id}>
                                <TableContainer
                                  contentSelected={selected}
                                  setSubContainer={setSubContent}
                                  subContainer={sub}
                                  loading={loading}
                                  container={container}
                                  hasFirst={i === 0}
                                  hasLast={ttl?.containers?.length === i + 1}
                                />

                                {sub?.id && container?.type === 'abas' && (
                                  <AbasContainer
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

          <ManualMap chapter={chapters} />
        </Table>
      </Content>

      <Header>
        {image2 && <LogoImage src="/img/logo_dark.svg" alt="Logo" />}
        <div>Manual Predial</div>
        <div>contato@manaulpredial.com / (31) 9882-0701</div>
      </Header>
    </PageLayout>
  );
};

export default PanelPage;
