export interface IManualList {
  id: number;
  type: ITypes;
  name: string;
  order: number;
  icon: string;
  visible: boolean;
  titles: ITitleList[];
}

export interface ITitleList {
  id: number;
  order: number;
  name: string;
  visible: boolean;
  content: IContainerList[];
}

export interface IContainerList {
  order: number;
  type: string;
  visible: boolean;
}

enum ITypes {
  CAPITULO = 'Capítulo',
  TITULO = 'Título',
  CONTAINER = 'Container',
}
