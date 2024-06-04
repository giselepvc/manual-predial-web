'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import { getIcons } from '@/services/querys/icons';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Action from '@/components/Action/Action';
import handleError from '@/utils/handleToast';
import api from '@/services/api';
import {
  ImageButton,
  IconsList,
  IconsTitle,
  MainComponent,
  Image,
} from './styles';

const IconsPage = () => {
  const query = useQueryClient();

  const iconsParams = {
    populate: '*',
    'pagination[page]': 1,
    'pagination[pageSize]': 100,
  };

  const { data: icons } = useQuery({
    queryKey: ['iconsData', iconsParams],
    queryFn: async () => {
      const result = await getIcons(iconsParams);
      const iconsResult = normalizeStrapi(result || []);

      iconsResult.sort((a, b) => a.id - b.id);

      return iconsResult;
    },
  });

  const onUpdate = async (id: number, active: boolean) => {
    try {
      await api.put(`/icons/${id}`, {
        data: {
          active: !active,
        },
      });

      query.invalidateQueries({ queryKey: ['iconsData'] });
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <PageLayout title="Listagem de ícones">
      <MainComponent>
        <Action title="Cadastrar novo ícone" notFilter href="/icons/create" />

        <IconsTitle>Ícones ativos</IconsTitle>

        <IconsList>
          {icons
            ?.filter(item => item.image.id && item.active)
            ?.map(icon => (
              <ImageButton
                selected={icon.active}
                onClick={() => onUpdate(icon.id, icon.active)}
              >
                <Image src={urlBuild(icon.image?.url)} alt={icon.title} />
              </ImageButton>
            ))}
        </IconsList>

        <IconsTitle>Ícones disponíveis</IconsTitle>

        <IconsList>
          {icons
            ?.filter(item => item.image.id)
            ?.map(icon => (
              <ImageButton
                selected={icon.active}
                onClick={() => onUpdate(icon.id, icon.active)}
              >
                <Image src={urlBuild(icon.image?.url)} alt={icon.title} />
              </ImageButton>
            ))}
        </IconsList>
      </MainComponent>
    </PageLayout>
  );
};

export default IconsPage;
