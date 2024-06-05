'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getClients } from '@/services/querys/clients';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { FaTrash } from 'react-icons/fa6';
import { useAuth } from '@/hooks/useAuth';
import EditIcon from '../../../../public/icons/edit.svg';
import { ActionButton, ActionSection } from './styles';

const UsersPage = () => {
  const { push } = useRouter();
  const { user, role } = useAuth();
  const query = useQueryClient();

  const isMaster = role === 3;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const clientsParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    ...(!isMaster && {
      'filters[$or][0][creativeEnterprise]': user?.enterprise?.title,
      'filters[$or][0][group][enterprise][id]': user?.enterprise?.id,
    }),
    'filters[users][role][id]': 4,
    'filters[users][id][$ne]': 60,
    'sort[createdAt]': 'DESC',
    populate: [
      'users',
      'users.image',
      'users.role',
      'group.enterprise.company',
      'enterprise.company',
    ],
  };

  const { data: clientsData } = useQuery({
    queryKey: ['usersData', clientsParams],
    queryFn: async () => getClients(clientsParams),
  });

  const onDelete = async () => {
    if (!deletingId) return;
    setIsUpdating(true);

    try {
      await api.delete(`/clients/${deletingId}`);
      handleSuccess('Usuário deletado com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['usersData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const clients = normalizeStrapi(clientsData || []);
  const fields = [
    'Nome',
    'Login',
    'Grupo',
    'Empreendimento',
    'Construtora',
    'Ações',
  ];

  return (
    <PageLayout title="Listagem de usuários final">
      <Action
        title="Cadastrar novo usuário"
        href="/final/create"
        setSearch={setSearch}
      />

      <TableComponent fields={fields}>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.name || '--'}</td>
            <td>{client.users?.username || '--'}</td>
            <td>{client.group?.name || '--'}</td>
            <td>{client.creativeEnterprise || '--'}</td>
            <td>{client.creativeCompany || '--'}</td>
            <td>
              <ActionSection>
                <ActionButton onClick={() => push(`/final/edit/${client.id}`)}>
                  <EditIcon />
                  Editar
                </ActionButton>
                <ActionButton onClick={() => setDeletingId(client.id)}>
                  <FaTrash />
                </ActionButton>
              </ActionSection>
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
