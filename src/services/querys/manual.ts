import { Paginated } from '@/interfaces/paginated';
import { IManualList } from '@/interfaces/manual';
import api from '../api';

export const getManuals = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IManualList>>('/manuals', {
    params,
  });

  return data;
};
