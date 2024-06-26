import { Paginated } from '@/interfaces/paginated';
import { IconsDatum } from '@/interfaces/icons';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import api from '../api';

export const getIcons = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IconsDatum>>('/icons', {
    params,
  });

  return data;
};

export const useIcons = (params: Record<string, any>, enabled?: boolean) => {
  const getIcons = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IconsDatum>>('/icons', {
      params,
    });

    if (data) {
      const iconsResult = normalizeStrapi(data);
      return iconsResult.sort((a, b) => a.id - b.id);
    }
  };

  return useQuery({
    queryKey: ['getIcons', params],
    queryFn: getIcons,
    enabled,
  });
};
