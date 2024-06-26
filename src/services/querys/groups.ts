import { Paginated } from '@/interfaces/paginated';
import { IGroups } from '@/interfaces/grups';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import api from '../api';

export const getGroups = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IGroups>>('/groups', {
    params,
  });

  return data;
};

export const useGroups = (params: Record<string, any>, enabled?: boolean) => {
  const getGroups = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IGroups>>('/groups', {
      params,
    });

    if (data) {
      return normalizeStrapi(data);
    }
  };

  return useQuery({
    queryKey: ['getGroups', params],
    queryFn: getGroups,
    enabled,
  });
};

export const useGroupsOptions = (
  params: Record<string, any>,
  enabled?: boolean,
) => {
  const getGroupsOptions = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IGroups>>('/groups', {
      params,
    });

    if (data) {
      const optionsList = normalizeStrapi(data || []);

      return (
        optionsList?.map(item => ({
          label: item.name || '',
          value: item.id?.toString() || '',
        })) || []
      );
    }

    return [];
  };

  return useQuery({
    queryKey: ['getGroupsOptions', params],
    queryFn: getGroupsOptions,
    enabled,
  });
};
