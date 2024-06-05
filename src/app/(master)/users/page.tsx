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
import EditIcon from '../../../../public/icons/edit.svg';
import { ActionButton, ActionsRows } from './styles';

const UsersPage = () => {
  const { push } = useRouter();
  const query = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const clientsParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    'filters[users][role][id]': 1,
    'sort[createdAt]': 'DESC',
    populate: [
      'users',
      'users.image',
      'group.enterprise',
      'enterprise',
      'users.role',
    ],
  };

  const { data: clientsData } = useQuery({
    queryKey: ['clientsData', clientsParams],
    queryFn: () => getClients(clientsParams),
  });

  const onDelete = async () => {
    if (!deletingId) return;
    setIsUpdating(true);

    try {
      const { data } = await api.delete(`/deleteUserById?userid=${deletingId}`);

      handleSuccess(data);
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['clientsData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const clients = normalizeStrapi(clientsData || []);
  const fields = ['Nome', 'Login', 'Empreendimento', 'CPF', 'Ações'];

  return (
    <PageLayout title="Listagem de usuários empreendimento">
      <Action
        title="Cadastrar novo usuário"
        href="/users/create"
        setSearch={setSearch}
      />

      <TableComponent fields={fields}>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.name || '--'}</td>
            <td>{client.users?.username || '--'}</td>
            <td>{client.creativeEnterprise || '--'}</td>
            <td>{client.cpf ? cpfMask(client.cpf) : '--'}</td>
            <td>
              <ActionsRows>
                <ActionButton onClick={() => push(`/users/edit/${client.id}`)}>
                  <EditIcon /> Editar
                </ActionButton>
                <ActionButton onClick={() => setDeletingId(client.users?.id)}>
                  <FaTrash />
                </ActionButton>
              </ActionsRows>
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
