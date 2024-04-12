import { Paginated } from '@/interfaces/paginated';
import { IEnterprises } from '@/interfaces/enterprise';
import api from '../api';

export const getEnterprise = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IEnterprises>>('/enterprises', {
    params,
  });

  return data;
};
