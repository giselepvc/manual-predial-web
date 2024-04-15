import { Paginated } from '@/interfaces/paginated';
import { IGroups } from '@/interfaces/grups';
import api from '../api';

export const getGroups = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IGroups>>('/groups', {
    params,
  });

  return data;
};
