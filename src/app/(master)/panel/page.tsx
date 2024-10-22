'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { CaptersDatum as IChapters } from '@/interfaces/manual';
import { TitlesDatum as ITitles } from '@/interfaces/manual';
import { ContentsDatum as IContents } from '@/interfaces/manual';
import { ContainerData as IContainers } from '@/interfaces/manual';
import { RecursiveNormalize as R } from '@/utils/normalizeStrapi';

import { getManuals } from '@/services/querys/manual';
import { useEnterprise } from '@/services/querys/enterprise';
import { urlBuild } from '@/utils/urlBuild';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useAuth } from '@/hooks/useAuth';

import PageLayout from '@/components/PageLayout/PageLayout';
import Loading from '@/components/Loading/Loading';
import TableContainer from './components/TableContainer/TableContainer';
import AbasContainer from './components/AbasContainer/AbasContainer';
import ChapterContainer from './components/ChapterContainer/ChapterContainer';
import TitleContainer from './components/TitleContainer/TitleContainer';
import ManualMap from './components/ManualMap/ManualMap';
import Footer from './components/Footer/Footer';

import { Content, Header, Table, Thread, Image, Separator } from './styles';

type ManualsParams = {
  [key: string]: string | number | undefined;
};

type IFilters = { visible: boolean; order: number };

const PanelPage = () => {
  const { user } = useAuth();
  const groupId = user?.group?.id;
  const enterpriseId = user?.group?.enterprise?.id;

  const [chapterSelected, setChapter] = useState<R<IChapters> | undefined>();
  const [titleSelected, setTitle] = useState<R<ITitles> | undefined>();
  const [sub, setSubContent] = useState<R<IContainers> | undefined>();

  const populate = [
    'capters.titles.containers.image',
    'enterprise.company.image',
    'capters.icon.image',
    'capters.titles.containers.pdf',
    'capters.titles.containers.icon.image',
    'capters.groups',
    'enterprise.image',
    'capters.titles.containers.sub_containers.pdf',
    'capters.titles.containers.sub_containers.icon.image',
    'capters.titles.containers.sub_containers.image',
    'capters.titles.containers.sub_containers.sub_containers',
    'capters.titles.containers.sub_containers.sub_containers.icon.image',
    'capters.titles.containers.sub_containers.sub_containers.image',
  ];

  const manualsParams: ManualsParams = populate.reduce((params, path, idx) => {
    params[`populate[${idx}]`] = path;
    return params;
  }, {} as ManualsParams);

  manualsParams['filters[capters][groups]'] = groupId;

  const fetchManuals = async () => {
    const data = await getManuals(manualsParams);
    return normalizeStrapi(data || [])?.[0];
  };

  const { data: manuals, isLoading } = useQuery({
    queryKey: ['manualForm', manualsParams],
    queryFn: fetchManuals,
    enabled: !!user?.group?.id,
  });

  const enterParams = {
    populate: 'groups.enterprise',
    'filters[id]': enterpriseId,
  };

  const { data: enterprises } = useEnterprise(enterParams, !!enterpriseId);

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

  const chapters =
    manuals?.capters.filter(c => c.groups.find(g => g.id === groupId)) || [];

  const filtered = <T extends IFilters>(list: T[]): T[] =>
    list.filter(item => item.visible).sort((a, b) => a.order - b.order);

  return (
    <PageLayout hasLogo logo={image1 && urlBuild(image1)}>
      <Header>
        {image2 && <Image src={urlBuild(image2)} alt="Logo" />}
        <div>{name || 'Manual Predial'}</div>
        <div>{addressList?.filter(i => i !== null).join(', ')}</div>
      </Header>

      <Content>
        <Table>
          {filtered<R<IChapters>>(chapters).map(chapter => (
            <>
              <ChapterContainer
                chapter={chapter}
                selected={chapterSelected}
                setSubContent={setSubContent}
                setSelected={setChapter}
              />
              {chapterSelected?.id === chapter.id &&
                filtered<R<ITitles>>(chapter.titles).map((title, index) => (
                  <>
                    <TitleContainer
                      index={index}
                      selected={titleSelected}
                      setSelected={setTitle}
                      setSubContent={setSubContent}
                      title={title}
                    />
                    {titleSelected?.id === title.id &&
                      filtered<R<IContents>>(title.containers).map(
                        (container, i) => (
                          <Thread key={container.id}>
                            <TableContainer
                              setSubContainer={setSubContent}
                              subContainer={sub}
                              container={container}
                              hasFirst={i === 0}
                              hasLast={title?.containers?.length === i + 1}
                            />
                            {sub?.id && container?.type === 'abas' && (
                              <AbasContainer
                                title={sub?.subtitle || ''}
                                subContainer={sub?.sub_containers || []}
                              />
                            )}
                          </Thread>
                        ),
                      )}
                    <Separator />
                  </>
                ))}
            </>
          ))}
          {chapters && chapters?.length > 0 && <ManualMap chapter={chapters} />}
        </Table>
      </Content>

      <Footer />
      {isLoading && <Loading />}
    </PageLayout>
  );
};

export default PanelPage;
