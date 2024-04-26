'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getClients } from '@/services/querys/clients';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import cpfMask from '@/utils/masks/cpfMask';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { FaTrash } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import EditIcon from '../../../../public/icons/edit.svg';
import { ActionButton } from './styles';

const UsersPage = () => {
  const { push } = useRouter();
  const { user } = useAuth();
  const query = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const clientsParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    'filters[group][enterprise][id]': user?.enterprise?.id || undefined,
    'filters[enterprise][id][$not]': null,
    'sort[createdAt]': 'DESC',
    populate: ['users', 'users.image', 'group.enterprise', 'enterprise'],
  };

  const { data: clientsData } = useQuery({
    queryKey: ['usersData', clientsParams],
    queryFn: async () => getClients(clientsParams),
  });

  const clients = normalizeStrapi(clientsData || []);

  const onDelete = async () => {
    if (!deletingId) return;

    try {
      setIsUpdating(true);
      await api.delete(`/clients/${deletingId}`);

      handleSuccess('Manual deletado com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['usersData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageLayout title="Listagem de usuários final">
      <Action
        title="Cadastrar novo usuário"
        href="/final/create"
        setSearch={setSearch}
      />

      <TableComponent fields={['Nome', 'Login', 'Grupo', 'CPF', 'Ações']}>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.name || '--'}</td>
            <td>{client.users?.email || '--'}</td>
            <td>{client.group?.name || '--'}</td>
            <td>{client.cpf ? cpfMask(client.cpf) : '--'}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                }}
              >
                <ActionButton onClick={() => push(`/final/edit/${client.id}`)}>
                  <EditIcon />
                  Editar
                </ActionButton>
                <ActionButton
                  onClick={() => (isUpdating ? null : setDeletingId(client.id))}
                >
                  <FaTrash />
                </ActionButton>
              </div>
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        pageCount={clientsData?.meta?.pagination?.pageCount || 0}
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
            Tem certeza que deseja <strong>excluir</strong> esse usuário?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </PageLayout>
  );
};

export default UsersPage;
