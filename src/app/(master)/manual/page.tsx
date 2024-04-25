'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getManuals } from '@/services/querys/manual';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useRouter } from 'next/navigation';
import { FaEye } from 'react-icons/fa6';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import { useAuth } from '@/hooks/useAuth';
import { ActionButton } from './styles';

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
    'filters[enterprise][id]': user?.enterprise?.id,
    'populate[0]': 'capters.titles.contents',
    'populate[1]': 'enterprise.company',
  };

  const { data: manualsdData } = useQuery({
    queryKey: ['manualList', manualsParams],
    queryFn: async () => getManuals(manualsParams),
  });

  const manuals = normalizeStrapi(manualsdData || []);

  const onDelete = async () => {
    if (!deletingId) {
      return;
    }

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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                }}
              >
                <ActionButton onClick={() => push(`/manual/edit/${manual.id}`)}>
                  <FaEye />
                  Visualizar
                </ActionButton>
              </div>
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
          onClose={() => setDeletingId(undefined)}
          onConfirm={onDelete}
          onCancel={() => setDeletingId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
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
