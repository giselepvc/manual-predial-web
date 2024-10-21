'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import PageLayout from '@/components/PageLayout/PageLayout';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';

import { getIcons } from '@/services/querys/icons';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';

import PlusIcon from '../../../../public/icons/plus.svg';

import {
  ImageButton,
  IconsList,
  IconsTitle,
  MainComponent,
  Image,
  DeleteIcon,
  IconWrapper,
  FilterRegister,
} from './styles';

const IconsPage = () => {
  const query = useQueryClient();
  const router = useRouter();

  const [deletingId, setDeletingId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const onDelete = async () => {
    if (!deletingId) return;

    setIsLoading(true);

    try {
      await api.delete(`/icons/${deletingId}`);

      handleSuccess('Ícone excluído com sucesso');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['iconsData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = () => {
    if (icons && icons?.length >= 100) {
      handleError('Não é possível cadastrar mais de 100 ícones');
      return;
    }

    router.push('/icons/create');
  };

  return (
    <PageLayout title="Listagem de ícones">
      <MainComponent>
        <FilterRegister onClick={handleNavigation}>
          <PlusIcon />
          Cadastrar novo ícone
        </FilterRegister>

        <IconsTitle>Ícones ativos</IconsTitle>

        <IconsList>
          {icons
            ?.filter(item => item.active)
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
          {icons?.map(icon => (
            <ImageButton selected={icon.active}>
              <IconWrapper onClick={() => onUpdate(icon.id, icon.active)}>
                <Image src={urlBuild(icon.image?.url)} alt={icon.title} />
              </IconWrapper>

              {!icon.active && (
                <DeleteIcon onClick={() => setDeletingId(icon.id)}>
                  x
                </DeleteIcon>
              )}
            </ImageButton>
          ))}
        </IconsList>
      </MainComponent>

      {deletingId && (
        <ConfirmModal
          title="Atenção"
          onClose={() => setDeletingId(undefined)}
          onConfirm={onDelete}
          onCancel={() => setDeletingId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          isLoading={isLoading}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>excluir</strong> esse ícone?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </PageLayout>
  );
};

export default IconsPage;
