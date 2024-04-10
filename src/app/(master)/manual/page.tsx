'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent, { mockOrders } from '@/components/Table/Table';
import EditIcon from '../../../../public/icons/edit.svg';

const ManualPage = () => {
  return (
    <PageLayout title="Listagem de manuais">
      <Action title="Cadastrar novo manual" />

      <TableComponent
        fields={[
          'ID',
          'Construtora',
          'CNPJ',
          'Nome do manual',
          'Capitulos',
          'Ações',
        ]}
      >
        {mockOrders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.customer}</td>
            <td>{order.customer}</td>
            <td>{order.equipment_count}</td>
            <td
              style={{
                display: 'flex',
                gap: '0.3rem',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <EditIcon />
              Editar
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination pageCount={7} />
    </PageLayout>
  );
};

export default ManualPage;
