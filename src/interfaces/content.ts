export interface IContent {
  id: number;
  attributes: PurpleAttributes;
}

export interface PurpleAttributes {
  title: string;
  description: string;
  subtitle: string;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  italic: boolean;
  type: string;
  image: Image;
  pdf: PDF;
  icon: Icon;
  sub_containers: SubContainers;
  container: Container;
}

export interface Icon {
  data: IconData | null;
}

export interface IconData {
  id: number;
  attributes: IconAttributes;
}

export interface IconAttributes {
  title: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image: IconImage;
}

export interface Container {
  data: ContainerData | null;
}

export interface ImageData {
  id: number;
  attributes: StickyAttributes;
}

export interface StickyAttributes {
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Formats {
  thumbnail: Thumbnail;
}

export interface Thumbnail {
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubContainers {
  data: ContainerData[];
}

export interface ContainerData {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  title: string;
  description: string;
  subtitle: string;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  italic: boolean | null;
  type: string;
  image: Image;
  pdf: PDF;
  icon: Icon;
  sub_containers: SubContainers;
  container: Container;
}

export interface IconImage {
  data: ImagesDatum | null;
}

export interface Image {
  data: ImagesDatum | null;
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
