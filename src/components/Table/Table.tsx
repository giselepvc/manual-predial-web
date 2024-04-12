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
