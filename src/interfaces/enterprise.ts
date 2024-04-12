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
  client: Client;
}

export interface Client {
  data: ClientData | null;
}

export interface ClientData {
  id: number;
  attributes: ClientAttributes;
}

export interface ClientAttributes {
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cpf: string;
  cnpj: string;
  phone: string;
  cellPhone: string;
  zipCode: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  referencePoint: null;
  complement: string;
  users: Users;
}

export interface Users {
  data: UsersData | null;
}

export interface UsersData {
  id: number;
  attributes: UsersAttributes;
}

export interface UsersAttributes {
  username: string;
  email: string;
}
