export interface ICompany {
  id: number;
  attributes: Attributes;
}

export interface Attributes {
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
  enterprises: Enterprises;
  image: Image;
}

export interface Enterprises {
  data: EnterprisesDatum[];
}

export interface Image {
  data: ImageDatum;
}

export interface ImageDatum {
  id: number;
  attributes: ImageAttributes;
}

export interface ImageAttributes {
  url: string;
  name: string;
}

export interface EnterprisesDatum {
  id: number;
  attributes: EnterpriseAttributes;
}

export interface EnterpriseAttributes {
  title: string;
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
