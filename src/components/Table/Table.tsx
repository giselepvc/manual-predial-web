/* eslint-disable jsx-a11y/control-has-associated-label */
import { Table, TableSection } from './styles';

export interface MockOrder {
  company_logo: string;
  id: string;
  customer: string;
  equipment_count: number;
  technician: string;
  status: string;
  type: string;
}

export const mockOrders: MockOrder[] = [
  {
    company_logo: '/cargill.png',
    id: '1001',
    customer: 'Felipe Augusto',
    equipment_count: 14,
    technician: '-',
    status: 'Não atribuído',
    type: 'Extintor',
  },
  {
    company_logo: '/petrobras.png',
    id: '1002',
    customer: 'Jhon Jhones',
    equipment_count: 12,
    technician: 'João Silva',
    status: 'Iniciada',
    type: 'Extintor/ Hidrante',
  },
  {
    company_logo: '/braskem.png',
    id: '1003',
    customer: 'Eduardo Lima',
    equipment_count: 10,
    technician: 'Gilberto Nobrega',
    status: 'Finalizada',
    type: 'Extintor',
  },
  {
    company_logo: '/cargill.png',
    id: '1004',
    customer: 'Fernando Reis',
    equipment_count: 9,
    technician: 'Manuel Gomes',
    status: 'Aprovada',
    type: 'Extintor/ Hidrante',
  },
  {
    company_logo: '/petrobras.png',
    id: '1005',
    customer: 'Julio Prestes',
    equipment_count: 8,
    technician: 'Gilberto Nobrega',
    status: 'Programada',
    type: 'Extintor',
  },
  {
    company_logo: '/braskem.png',
    id: '1006',
    customer: 'Trevor Philips',
    equipment_count: 12,
    technician: 'João Silva',
    status: 'Rascunho',
    type: 'Extintor/ Hidrante',
  },
  {
    company_logo: '/cargill.png',
    id: '1007',
    customer: 'Michael de Santa',
    equipment_count: 12,
    technician: 'Gilberto Nobrega',
    status: 'Programada',
    type: 'Extintor',
  },
  {
    company_logo: '/petrobras.png',
    id: '1008',
    customer: 'Leonardo Fernandez',
    equipment_count: 18,
    technician: 'James Vicendo',
    status: 'Iniciada',
    type: 'Extintor/ Hidrante',
  },
  {
    company_logo: '/braskem.png',
    id: '1009',
    customer: 'Franklin Clinton',
    equipment_count: 14,
    technician: 'Gilberto Nobrega',
    status: 'Programada',
    type: 'Extintor',
  },
  {
    company_logo: '/cargill.png',
    id: '1010',
    customer: 'Lamar Davis',
    equipment_count: 16,
    technician: 'Niko Belic',
    status: 'Programada',
    type: 'Extintor/ Hidrante',
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
              style={{ height: '0.375rem', background: 'transparent' }}
            />
          </tr>

          {children}
        </tbody>
      </Table>
    </TableSection>
  );
};

export default TableComponent;
