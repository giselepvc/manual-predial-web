import { Paginated } from '@/interfaces/paginated';
import { IContent } from '@/interfaces/content';
import api from '../api';

export const getContents = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IContent>>('/containers', {
    params,
  });

  return data;
};
