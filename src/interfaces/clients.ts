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
  enterprise: IEnterprise;
}

export interface IUsers {
  data: IUserClient;
}

export interface IEnterprise {
  data: IEnterpriseDatum;
}

export interface IUserClient {
  id: number;
  attributes: IUserClientAttributes;
}

export interface IEnterpriseDatum {
  id: number;
  attributes: IEnterpriseAttributes;
}

export interface IUserClientAttributes {
  username: string;
  email: string;
  image: IImage;
}

export interface IImage {
  data: IImageDatum;
}

export interface IImageDatum {
  id: number;
  attributes: IImagesttributes;
}

export interface IImagesttributes {
  name: string;
  url: string;
}

export interface IEnterpriseAttributes {
  title: string;
}
