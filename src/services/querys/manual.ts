import { Paginated } from '@/interfaces/paginated';
import { IManualList } from '@/interfaces/manual';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import api from '../api';

export const getManuals = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IManualList>>('/manuals', {
    params,
  });

  return data;
};

export const useManuals = (params: Record<string, any>, enabled?: boolean) => {
  const getManuals = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IManualList>>('/manuals', {
      params,
    });

    if (data) {
      return normalizeStrapi(data);
    }
  };

  return useQuery({
    queryKey: ['getManuals', params],
    queryFn: getManuals,
    enabled,
  });
};

export const useManualsToChapters = (
  params: Record<string, any>,
  enabled?: boolean,
) => {
  const getManuals = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IManualList>>('/manuals', {
      params,
    });

    if (data) {
      const result = normalizeStrapi(data);
      const chapters = result.flatMap(manual => manual.capters);
      return chapters;
    }
  };

  return useQuery({
    queryKey: ['getManuals', params],
    queryFn: getManuals,
    enabled,
  });
};
