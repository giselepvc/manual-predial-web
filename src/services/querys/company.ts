import { Paginated } from '@/interfaces/paginated';
import { ICompany } from '@/interfaces/company';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import api from '../api';

export const getCompanies = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<ICompany>>('/companies', {
    params,
  });

  return data;
};

export const useCompanies = (params: Record<string, any>) => {
  const getCompanies = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<ICompany>>('/companies', {
      params,
    });

    if (data) {
      return normalizeStrapi(data);
    }
  };

  return useQuery({
    queryKey: ['getCompanies', params],
    queryFn: getCompanies,
  });
};

export const useCompaniesOptions = (params: Record<string, any>) => {
  const getCompaniesOptions = async ({ queryKey }: QueryFunctionContext) => {
    const [, params] = queryKey;

    const { data } = await api.get<Paginated<ICompany>>('/companies', {
      params,
    });

    if (data) {
      const companiesList = normalizeStrapi(data || []);

      return (
        companiesList?.map(enter => ({
          label: enter.name || '',
          value: enter.id?.toString() || '',
        })) || []
      );
    }

    return [];
  };

  return useQuery({
    queryKey: ['getCompaniesOptions', params],
    queryFn: getCompaniesOptions,
  });
};
