export interface IEnterprises {
  id: number;
  attributes: PurpleAttributes;
}

export interface PurpleAttributes {
  title: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cnpj: string;
  email: string;
  phone: string;
  zipCode: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  manuals: Manuals;
  client: Client;
  groups: Groups;
  company: Client;
}

export interface Client {
  data: ClientData | null;
}

export interface ClientData {
  id: number;
  attributes: DataAttributes;
}

export interface DataAttributes {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  cpf?: string;
  cnpj: string;
  phone: string;
  cellPhone?: string;
  zipCode: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  referencePoint?: null;
  complement: string;
  active?: boolean;
  email?: string;
}

export interface Groups {
  data: GroupsDatum[];
}

export interface GroupsDatum {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface Manuals {
  data: ManualsDatum[];
}

export interface ManualsDatum {
  id: number;
  attributes: TentacledAttributes;
}

export interface TentacledAttributes {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  visible: boolean;
}
