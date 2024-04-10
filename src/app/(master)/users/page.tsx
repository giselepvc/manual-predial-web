'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent, { mockOrders } from '@/components/Table/Table';

const UsersPage = () => {
  return (
    <PageLayout title="Listagem de usuários">
      <Action title="Cadastrar novo usuário" href="/users/create" />

      <TableComponent
        fields={['ID', 'Nome', 'E-mail', 'CPF', 'CNPJ', 'Celular', 'CEP']}
      >
        {mockOrders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.customer}</td>
            <td>{order.cpf}</td>
            <td>{order.cnpj}</td>
            <td>{order.type}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </TableComponent>

      <Pagination pageCount={7} />
    </PageLayout>
  );
};

export default UsersPage;
