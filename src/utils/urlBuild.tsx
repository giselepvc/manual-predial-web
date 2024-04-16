import { baseURL } from '@/services/api';

export const urlBuild = (path: string) => {
  return `${baseURL?.replace('/api/', '')}${path}`;
};
