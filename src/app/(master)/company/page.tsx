'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getCompanies } from '@/services/querys/company';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa6';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import EditIcon from '../../../../public/icons/edit.svg';
import { ActionButton } from './styles';

const CompanyPage = () => {
  const { push } = useRouter();
  const query = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  const companiesParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    'sort[createdAt]': 'DESC',
    populate: '*',
  };

  const { data: companiesData } = useQuery({
    queryKey: ['CompaniesData', companiesParams],
    queryFn: async () => getCompanies(companiesParams),
  });

  const companies = normalizeStrapi(companiesData || []);

  const onDelete = async () => {
    if (!deletingId) return;

    try {
      setIsUpdating(true);
      await api.delete(`/companies/${deletingId}`);

      handleSuccess('Construtora deletada com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['CompaniesData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageLayout title="Listagem de construtoras">
      <Action
        title="Cadastrar nova construtora"
        setSearch={setSearch}
        href="/company/create"
      />

      <TableComponent
        fields={['Nome', 'E-mail', 'CNPJ', 'CEP', 'Status', 'Ações']}
      >
        {companies.map(order => (
          <tr key={order.id}>
            <td>{order.name}</td>
            <td>{order.email || '--'}</td>
            <td>{order.cnpj || '--'}</td>
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
                <ActionButton onClick={() => push(`/company/edit/${order.id}`)}>
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
        pageCount={companiesData?.meta?.pagination?.pageCount || 0}
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
            Tem certeza que deseja <strong>excluir</strong> essa construtora?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </PageLayout>
  );
};

export default CompanyPage;
