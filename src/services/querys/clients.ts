import { IClients } from '@/interfaces/clients';
import { Paginated } from '@/interfaces/paginated';
import api from '../api';

export const getClients = async (params: Record<string, any>) => {
  const { data } = await api.get<Paginated<IClients>>('/clients', {
    params,
  });

  return data;
};
