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
  icon: IIcon;
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
  containers: Contents;
}

export interface Contents {
  data: ContentsDatum[];
}

export interface ContentsDatum {
  id: number;
  attributes: ContentsAttributes;
}

export interface ContentsAttributes {
  type: string;
  title: string;
  order: number;
  description: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: Images;
  pdf: PDF;
  icon: IIcon;
}

export interface Images {
  data: ImagesDatum[] | null;
}

export interface IconDatum {
  id: number;
  attributes: ImagesAttributes;
}

export interface PDF {
  data: ImagesDatum | null;
}

export interface ImagesDatum {
  id: number;
  attributes: ImagesAttributes;
}

export interface ImagesAttributes {
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
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
  company: Company;
}

export interface Company {
  data: CompanyDatum | null;
}

export interface CompanyDatum {
  id: number;
  attributes: CompanyAttributes;
}

export interface CompanyAttributes {
  name: string;
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

export interface IIcon {
  data: IIconData;
}

export interface IIconData {
  id: number;
  attributes: PurpleAttributes;
}

export interface PurpleAttributes {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  active: boolean;
  image: Image;
}

export interface Image {
  data: ImageData;
}

export interface ImageData {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  name: string;
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: Date;
  updatedAt: Date;
}
