'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa6';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import { getGroups } from '@/services/querys/groups';
import { ActionButton } from './styles';
import EditIcon from '../../../../public/icons/edit.svg';

const GroupPage = () => {
  const { push } = useRouter();
  const query = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const groupsParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    populate: '*',
  };

  const { data: groupsData } = useQuery({
    queryKey: ['groupList', groupsParams],
    queryFn: async () => getGroups(groupsParams),
  });

  const groups = normalizeStrapi(groupsData || []);

  const onDelete = async () => {
    if (!deletingId) {
      return;
    }

    try {
      setIsUpdating(true);
      await api.delete(`/groups/${deletingId}`);

      handleSuccess('Grupo deletado com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['groupList'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageLayout title="Listagem de grupos">
      <Action
        title="Cadastrar novo grupo"
        href="/manual/create"
        setSearch={setSearch}
      />

      <TableComponent
        fields={['ID', 'Nome do grupo', 'Empreendimento', 'Capitulos', 'Ações']}
      >
        {groups.map(manual => (
          <tr key={manual.id}>
            <td>{manual.id}</td>
            <td>{manual.name}</td>
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
                  <EditIcon />
                  Editar
                </ActionButton>
                <ActionButton
                  onClick={() => (isUpdating ? null : setDeletingId(manual.id))}
                >
                  <FaTrash />
                </ActionButton>
              </div>
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        pageCount={groupsData?.meta?.pagination?.pageCount || 0}
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
            Tem certeza que deseja <strong>excluir</strong> esse grupo?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </PageLayout>
  );
};

export default GroupPage;
