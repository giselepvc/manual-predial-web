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
