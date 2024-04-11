/* eslint-disable jsx-a11y/control-has-associated-label */
import { Table, TableSection } from './styles';

export interface MockOrder {
  id: string;
  customer: string;
  equipment_count: number;
  cpf: string;
  cnpj: string;
  status: string;
  type: string;
}

export const mockOrders: MockOrder[] = [
  {
    id: '1001',
    customer: 'Felipe Augusto',
    equipment_count: 14,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Não atribuído',
    type: 'Extintor',
  },
  {
    id: '1002',
    customer: 'Jhon Jhones',
    equipment_count: 12,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Iniciada',
    type: 'Extintor/ Hidrante',
  },
  {
    id: '1003',
    customer: 'Eduardo Lima',
    equipment_count: 10,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Finalizada',
    type: 'Extintor',
  },
  {
    id: '1004',
    customer: 'Fernando Reis',
    equipment_count: 9,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Aprovada',
    type: 'Extintor/ Hidrante',
  },
  {
    id: '1005',
    customer: 'Julio Prestes',
    equipment_count: 8,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Programada',
    type: 'Extintor',
  },
  {
    id: '1006',
    customer: 'Trevor Philips',
    equipment_count: 12,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Rascunho',
    type: 'Extintor/ Hidrante',
  },
  {
    id: '1007',
    customer: 'Michael de Santa',
    equipment_count: 12,
    cpf: '475.213.908-17',
    cnpj: '47.078.568/0001-99',
    status: 'Programada',
    type: 'Extintor',
  },
];

interface TableProps {
  fields: string[];
  children: React.ReactNode;
}

const TableComponent = ({ children, fields }: TableProps) => {
  return (
    <TableSection>
      <Table>
        <thead>
          <tr>
            {fields.map(field => (
              <th>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={8}
              style={{ height: '0.1rem', background: 'transparent' }}
            />
          </tr>

          {children}
        </tbody>
      </Table>
    </TableSection>
  );
};

export default TableComponent;
