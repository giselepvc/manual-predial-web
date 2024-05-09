export interface IconsDatum {
  id: number;
  attributes: IconsAttributes;
}

export interface IconsAttributes {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  active: boolean;
  image: Image;
  capters: Capters;
  containers: Containers;
}

export interface Capters {
  data: CaptersDatum[];
}

export interface CaptersDatum {
  id: number;
  attributes: CaptersAttributes;
}

export interface CaptersAttributes {
  title: string;
  order: number;
  visible: boolean;
}

export interface Containers {
  data: ContainersDatum[];
}

export interface ContainersDatum {
  id: number;
  attributes: ContainersAttributes;
}

export interface ContainersAttributes {
  title: string;
  order: number;
  visible: boolean;
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
