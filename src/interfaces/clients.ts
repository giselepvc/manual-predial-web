export interface IClients {
  id: number;
  attributes: IClientsAttributes;
}

export interface IClientsAttributes {
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
  users: IUsers;
}

export interface IUsers {
  data: IUserClient;
}

export interface IUserClient {
  id: number;
  attributes: IUserClientAttributes;
}

export interface IUserClientAttributes {
  username: string;
  email: string;
}
