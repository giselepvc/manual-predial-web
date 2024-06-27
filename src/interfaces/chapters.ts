export interface IChapters {
  id: number;
  attributes: ChaptersAttributes;
}

export interface ChaptersAttributes {
  title: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  visible: boolean;
  type: string;
  icon: Icon;
  groups: Groups;
  titles: Titles;
}

export interface Groups {
  data: GroupsDatum[];
}

export interface GroupsDatum {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface Icon {
  data: Data;
}

export interface Data {
  id: number;
  attributes: DataAttributes;
}

export interface DataAttributes {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  active: boolean;
}

export interface Titles {
  data: TitlesDatum[];
}

export interface TitlesDatum {
  id: number;
  attributes: TentacledAttributes;
}

export interface TentacledAttributes {
  title: string;
  description: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  order: number;
}
