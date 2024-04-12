'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getCompanies } from '@/services/querys/company';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const CompanyPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const enterpriseParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    populate: 'client.users',
  };

  const { data: companiesData } = useQuery({
    queryKey: ['CompaniesData', enterpriseParams],
    queryFn: async () => getCompanies(enterpriseParams),
  });

  const companies = normalizeStrapi(companiesData || []);

  return (
    <PageLayout title="Listagem de construtora">
      <Action title="Cadastrar nova construtora" setSearch={setSearch} />

      <TableComponent
        fields={['ID', 'Nome', 'E-mail', 'CNPJ', 'Celular', 'CEP', 'Status']}
      >
        {companies.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.name}</td>
            <td>{order.email}</td>
            <td>{order.cnpj}</td>
            <td>{order.phone}</td>
            <td>{order.zipCode}</td>
            <td>{order.active ? 'Ativo' : 'Desativado'}</td>
          </tr>
        ))}
      </TableComponent>

      <Pagination
        pageCount={companiesData?.meta?.pagination?.pageCount || 0}
        forcePage={page - 1}
        onPageChange={p => setPage(p.selected + 1)}
      />
    </PageLayout>
  );
};

export default CompanyPage;
