import { Paginated } from '@/interfaces/paginated';
import { IconsDatum } from '@/interfaces/icons';
import api from '../api';

export const getIcons = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IconsDatum>>('/icons', {
    params,
  });

  return data;
};
