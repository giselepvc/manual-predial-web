'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getEnterprise } from '@/services/querys/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const EnterprisePage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const enterpriseParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[title][$containsi]': search || undefined,
    populate: 'client.users',
  };

  const { data: enterpriseData } = useQuery({
    queryKey: ['myItems', enterpriseParams],
    queryFn: async () => getEnterprise(enterpriseParams),
  });

  const enterprises = normalizeStrapi(enterpriseData || []);

  return (
    <PageLayout title="Listagem de emprendimento">
      <Action title="Cadastrar novo emprendimento" setSearch={setSearch} />

      <TableComponent
        fields={['ID', 'Nome', 'E-mail', 'CNPJ', 'Celular', 'CEP', 'Status']}
      >
        {enterprises?.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.title || '--'}</td>
            <td>{order.client?.users?.email || '--'}</td>
            <td>{order.client?.cnpj || '--'}</td>
            <td>{order.client?.cellPhone || '--'}</td>
            <td>{order.client?.zipCode || '--'}</td>
            <td>{order.active ? 'Ativo' : 'Desativado'}</td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        pageCount={enterpriseData?.meta?.pagination?.pageCount || 0}
        forcePage={page - 1}
        onPageChange={p => setPage(p.selected + 1)}
      />
    </PageLayout>
  );
};

export default EnterprisePage;
