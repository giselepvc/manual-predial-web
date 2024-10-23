'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaEye, FaTrash } from 'react-icons/fa6';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';

import { getManuals } from '@/services/querys/manual';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useAuth } from '@/hooks/useAuth';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';

import EditIcon from '../../../../public/icons/edit.svg';

import { ActionButton, Wrapper } from './styles';

const ManualPage = () => {
  const { push } = useRouter();
  const { role, user } = useAuth();
  const query = useQueryClient();
  const isCompany = role === 1;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const manualsParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[title][$containsi]': search || undefined,
    ...(isCompany && { 'filters[enterprise][id]': user?.enterprise?.id }),
    populate: ['capters.titles.contents', 'enterprise.company'],
  };

  const { data: manualsdData } = useQuery({
    queryKey: ['manualList', manualsParams],
    queryFn: async () => getManuals(manualsParams),
  });

  const manuals = normalizeStrapi(manualsdData || []);

  const onDelete = async () => {
    if (!deletingId) return;

    try {
      setIsUpdating(true);

      await api.delete(`/manuals/${deletingId}`);

      handleSuccess('Manual deletado com sucesso.');
      setDeletingId(undefined);

      query.invalidateQueries({ queryKey: ['manualList'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (id: number) => {
    if (isUpdating) return;

    setDeletingId(id);
  };

  const handleEdit = (id: number) => {
    push(`/manual/edit/${id}`);
  };

  return (
    <PageLayout title="Listagem de manuais">
      <Action
        title={isCompany ? undefined : 'Cadastrar novo manual'}
        href={isCompany ? undefined : '/manual/create'}
        setSearch={setSearch}
      />

      <TableComponent
        fields={[
          'Nome do manual',
          'Construtora',
          'Empreendimento',
          'Capitulos',
          'Ações',
        ]}
      >
        {manuals.map(manual => (
          <tr key={manual.id}>
            <td>{manual.title}</td>
            <td>{manual.enterprise?.company?.name || '--'}</td>
            <td>{manual.enterprise?.title || '--'}</td>
            <td>{manual.capters?.length || 0}</td>
            <td>
              {isCompany && (
                <Wrapper>
                  <ActionButton onClick={() => handleEdit(manual.id)}>
                    <FaEye />
                    Visualizar
                  </ActionButton>
                </Wrapper>
              )}
              {!isCompany && (
                <Wrapper>
                  <ActionButton onClick={() => handleEdit(manual.id)}>
                    <EditIcon />
                    Editar
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(manual.id)}>
                    <FaTrash />
                  </ActionButton>
                </Wrapper>
              )}
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        pageCount={manualsdData?.meta?.pagination?.pageCount || 0}
        forcePage={page - 1}
        onPageChange={p => setPage(p.selected + 1)}
      />

      {deletingId && (
        <ConfirmModal
          title="Atenção"
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          onConfirm={onDelete}
          onClose={() => setDeletingId(undefined)}
          onCancel={() => setDeletingId(undefined)}
          isLoading={isUpdating}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>excluir</strong> esse manual?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </PageLayout>
  );
};

export default ManualPage;
