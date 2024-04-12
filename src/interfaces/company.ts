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
}

export interface Enterprises {
  data: any[];
}
