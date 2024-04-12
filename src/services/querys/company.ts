import { Paginated } from '@/interfaces/paginated';
import { ICompany } from '@/interfaces/company';
import api from '../api';

export const getCompanies = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<ICompany>>('/companies', {
    params,
  });

  return data;
};
