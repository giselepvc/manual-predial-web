import { Paginated } from '@/interfaces/paginated';
import { IEnterprises } from '@/interfaces/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import api from '../api';

export const getEnterprise = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IEnterprises>>('/enterprises', {
    params,
  });

  return data;
};

export const useEnterprise = (
  params: Record<string, any>,
  enabled?: boolean,
) => {
  const getEnterprise = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IEnterprises>>('/enterprises', {
      params,
    });

    if (data) {
      return normalizeStrapi(data || []);
    }

    return [];
  };

  return useQuery({
    queryKey: ['getEnterprise', params],
    queryFn: getEnterprise,
    enabled,
  });
};

export const useEnterpriseOptions = (
  params: Record<string, any>,
  enabled?: boolean,
) => {
  const getEnterpriseOptions = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<IEnterprises>>('/enterprises', {
      params,
    });

    if (data) {
      const optionsList = normalizeStrapi(data || []);

      return (
        optionsList?.map(item => ({
          label: item.title || '',
          value: item.id?.toString() || '',
        })) || []
      );
    }

    return [];
  };

  return useQuery({
    queryKey: ['getCompaniesOptions', params],
    queryFn: getEnterpriseOptions,
    enabled,
  });
};
