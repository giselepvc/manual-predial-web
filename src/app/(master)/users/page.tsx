'use client';

import { useQuery } from '@tanstack/react-query';
import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';
import Pagination from '@/components/Pagination/Pagination';
import TableComponent from '@/components/Table/Table';
import { getClients } from '@/services/querys/clients';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import cpfMask from '@/utils/masks/cpfMask';
import cnpjMask from '@/utils/masks/cnpjMask';
import telephoneMask from '@/utils/masks/phone';
import zipcodeMask from '@/utils/masks/cep';
import { useRouter } from 'next/navigation';
import EditIcon from '../../../../public/icons/edit.svg';
import { ActionButton } from './styles';

const UsersPage = () => {
  const { push } = useRouter();

  const clientsParams = {
    populate: 'users',
  };

  const { data: clientsData } = useQuery({
    queryKey: ['myItems', clientsParams],
    queryFn: async () => getClients(clientsParams),
  });

  const clients = normalizeStrapi(clientsData || []);

  console.log(clients);

  return (
    <PageLayout title="Listagem de usuários">
      <Action title="Cadastrar novo usuário" href="/users/create" />

      <TableComponent
        fields={['Nome', 'E-mail', 'CPF', 'CNPJ', 'Celular', 'CEP', 'Ações']}
      >
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.name.toLowerCase()}</td>
            <td>{client.users?.email}</td>
            <td>{cpfMask(client.cpf)}</td>
            <td>{cnpjMask(client.cnpj)}</td>
            <td>{telephoneMask(client.cellPhone)}</td>
            <td>{zipcodeMask(client.zipCode)}</td>
            <td>
              <ActionButton onClick={() => push(`/users/edit/${client.id}`)}>
                <EditIcon />
                Editar
              </ActionButton>
            </td>
          </tr>
        ))}
      </TableComponent>

      <Pagination pageCount={clientsData?.meta?.pagination?.pageCount || 0} />
    </PageLayout>
  );
};

export default UsersPage;
