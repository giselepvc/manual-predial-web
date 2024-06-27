import { Paginated } from '@/interfaces/paginated';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { IChapters } from '@/interfaces/chapters';
import api from '../api';

export const useChapter = (params: Record<string, any>, enabled?: boolean) => {
  const getChapter = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IChapters>>('/capters', {
      params,
    });

    if (data) {
      return normalizeStrapi(data);
    }
  };

  return useQuery({
    queryKey: ['getChapter', params],
    queryFn: getChapter,
    enabled,
  });
};
