'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getEnterprise } from '@/services/querys/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa6';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import { ActionButton } from './styles';
import EditIcon from '../../../../public/icons/edit.svg';

const EnterprisePage = () => {
  const { push } = useRouter();
  const query = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const enterpriseParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[title][$containsi]': search || undefined,
    'sort[createdAt]': 'DESC',
    populate: 'client.users',
  };

  const { data: enterpriseData } = useQuery({
    queryKey: ['enterpriseData', enterpriseParams],
    queryFn: async () => getEnterprise(enterpriseParams),
  });

  const enterprises = normalizeStrapi(enterpriseData || []);

  const onDelete = async () => {
    if (!deletingId) {
      return;
    }

    try {
      setIsUpdating(true);
      await api.delete(`/enterprises/${deletingId}`);

      handleSuccess('Empreendimento deletado com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['enterpriseData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageLayout title="Listagem de empreendimento">
      <Action
        title="Cadastrar novo empreendimento"
        setSearch={setSearch}
        href="/enterprise/create"
      />

      <TableComponent
        fields={['Nome', 'E-mail', 'CNPJ', 'Celular', 'CEP', 'Status', 'Ações']}
      >
        {enterprises?.map(order => (
          <tr key={order.id}>
            <td>{order.title || '--'}</td>
            <td>{order.email || '--'}</td>
            <td>{order.cnpj || '--'}</td>
            <td>{order.phone || '--'}</td>
            <td>{order.zipCode || '--'}</td>
            <td>{order.active ? 'Ativo' : 'Desativado'}</td>
            <td>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                }}
              >
                <ActionButton
                  onClick={() => push(`/enterprise/edit/${order.id}`)}
                >
                  <EditIcon />
                  Editar
                </ActionButton>
                <ActionButton
                  onClick={() => (isUpdating ? null : setDeletingId(order.id))}
                >
                  <FaTrash />
                </ActionButton>
              </div>
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        pageCount={enterpriseData?.meta?.pagination?.pageCount || 0}
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
            Tem certeza que deseja <strong>excluir</strong> esse empreendimento?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </PageLayout>
  );
};

export default EnterprisePage;
