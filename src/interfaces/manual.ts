export enum ITypes {
  CAPITULO = 'Capítulo',
  TITULO = 'Título',
  CONTAINER = 'Container',
}

export interface IManualList {
  id: number;
  attributes: ManualAttributes;
}

export interface ManualAttributes {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  visible: boolean;
  capters: Capters;
  enterprise: Enterprise;
}

export interface Capters {
  data: CaptersDatum[] | null;
}

export interface CaptersDatum {
  id: number;
  attributes: CaptersAttributes;
}

export interface CaptersAttributes {
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  visible: boolean;
  titles: Titles;
}

export interface Titles {
  data: TitlesDatum[];
}

export interface TitlesDatum {
  id: number;
  attributes: TitlesAttributes;
}

export interface TitlesAttributes {
  title: string;
  description: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  contents: Contents;
}

export interface Contents {
  data: ContentsDatum[];
}

export interface ContentsDatum {
  id: number;
  attributes: ContentsAttributes;
}

export interface ContentsAttributes {
  key: string;
  description: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Enterprise {
  data: EnterpriseDatum | null;
}

export interface EnterpriseDatum {
  id: number;
  attributes: EnterpriseAttributes;
}

export interface EnterpriseAttributes {
  title: string;
  active: boolean;
}

export interface ResponseManual {
  data: Data;
  meta: Meta;
}

export interface Data {
  id: number;
  attributes: Attributes;
}

export interface Attributes {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  visible: boolean;
}

export interface Meta {}
