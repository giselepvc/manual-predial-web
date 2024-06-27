export interface IGroups {
  id: number;
  attributes: GroupsAttributes;
}

export interface GroupsAttributes {
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  capters: Capters;
  enterprise: Enterprise;
}

export interface Capters {
  data: CaptersDatum[] | null;
}

export interface CaptersDatum {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  visible: boolean;
  type: string;
  icon: IIcon;
  groups: Group;
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

export interface Enterprise {
  data: EnterpriseDatum | null;
}

export interface EnterpriseDatum {
  id: number;
  attributes: EnterpriseAttributes;
  company: Company;
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
  attributes: ImageAttributes;
}

export interface ImageAttributes {
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
