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
  group: Group;
}

export interface IUsers {
  data: IUserClient;
}

export interface Group {
  data: IGroupClient;
}

export interface IGroupClient {
  id: number;
  attributes: IGroupAttributes;
}

export interface IGroupAttributes {
  createdAt: string;
  name: string;
  publishedAt: string;
  updatedAt: string;
  enterprise: IEnterprise;
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
  zipCode: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  company: ICompany;
}

export interface ICompany {
  data: ICompanyDatum;
}

export interface ICompanyDatum {
  id: number;
  attributes: ICompanyAttributes;
}

export interface ICompanyAttributes {
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  active: boolean;
  cnpj: string;
  email: string;
  zipCode: string;
  phone: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: null;
}
