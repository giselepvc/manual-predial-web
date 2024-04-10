'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent, { mockOrders } from '@/components/Table/Table';

const CompanyPage = () => {
  return (
    <PageLayout title="Listagem de construtora">
      <Action title="Cadastrar nova construtora" />

      <TableComponent
        fields={['ID', 'Nome', 'E-mail', 'CNPJ', 'Celular', 'CEP', 'Status']}
      >
        {mockOrders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.customer}</td>
            <td>{order.customer}</td>
            <td>{order.status}</td>
            <td>{order.type}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </TableComponent>

      <Pagination pageCount={7} />
    </PageLayout>
  );
};

export default CompanyPage;
