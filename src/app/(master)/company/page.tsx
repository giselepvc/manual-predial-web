'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getCompanies } from '@/services/querys/company';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '../../../../public/icons/edit.svg';
import { ActionButton } from './styles';

const CompanyPage = () => {
  const { push } = useRouter();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const companiesParams = {
    'pagination[page]': page,
    'pagination[pageSize]': 7,
    'filters[name][$containsi]': search || undefined,
    populate: '*',
  };

  const { data: companiesData } = useQuery({
    queryKey: ['CompaniesData', companiesParams],
    queryFn: async () => getCompanies(companiesParams),
  });

  const companies = normalizeStrapi(companiesData || []);

  return (
    <PageLayout title="Listagem de construtora">
      <Action
        title="Cadastrar nova construtora"
        setSearch={setSearch}
        href="/company/create"
      />

      <TableComponent
        fields={['Nome', 'E-mail', 'CNPJ', 'Celular', 'CEP', 'Status', 'Ações']}
      >
        {companies.map(order => (
          <tr key={order.id}>
            <td>{order.name}</td>
            <td>{order.email}</td>
            <td>{order.cnpj}</td>
            <td>{order.phone}</td>
            <td>{order.zipCode}</td>
            <td>{order.active ? 'Ativo' : 'Desativado'}</td>
            <td>
              <ActionButton onClick={() => push(`/company/edit/${order.id}`)}>
                <EditIcon />
                Editar
              </ActionButton>
            </td>
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
