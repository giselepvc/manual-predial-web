import { IClients } from '@/interfaces/clients';
import { Paginated } from '@/interfaces/paginated';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import api from '../api';

export const getClients = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IClients>>('/clients', {
    params,
  });

  return data;
};

export const useClients = (params: Record<string, any>, enabled?: boolean) => {
  const getClients = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IClients>>('/clients', {
      params,
    });

    if (data) {
      return normalizeStrapi(data);
    }
  };

  return useQuery({
    queryKey: ['getCompanies', params],
    queryFn: getClients,
    enabled,
  });
};
