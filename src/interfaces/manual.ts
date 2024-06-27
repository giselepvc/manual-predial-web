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
  groups: Group;
  icon: IIcon;
  type: string | null;
}

export interface Group {
  data: GroupDatum[];
}

export interface GroupDatum {
  id: number;
  attributes: GroupAttributes;
}

export interface GroupAttributes {
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
  order: number;
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
  subtitle: string;
  order: number;
  description: string;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  italic: boolean;
  image: Image;
  pdf: PDF;
  icon: IIcon;
  sub_containers: SubContainers;
  container: Container;
}

export interface Container {
  data: ContainerData | null;
}

export interface SubContainers {
  data: ContainerData[];
}

export interface ContainerData {
  id: number;
  attributes: ContainerAttributes;
}

export interface ContainerAttributes {
  title: string;
  description: string;
  subtitle: string;
  visible: boolean;
  italic: boolean | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: string;
  pdf: PDF;
  image: Image;
  icon: IIcon;
  sub_containers: SubContainers;
}

export interface Images {
  data: ImagesDatum[] | null;
}

export interface PDF {
  data: ImagesDatum | null;
}

export interface ImagesDatum {
  id: number;
  attributes: ImagesAttributes;
}

export interface IconDatum {
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
  zipCode: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
  active: boolean;
  company: Company;
  image: Image;
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
  image: Image;
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
  url: string;
  createdAt: string;
  updatedAt: string;
}
