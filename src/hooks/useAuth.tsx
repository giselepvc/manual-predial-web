/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { IClients } from '@/interfaces/clients';
import { getClients } from '@/services/querys/clients';
import { localStorageKeys } from '@/utils/localStorageKeys';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { useQuery } from '@tanstack/react-query';
import { redirect, usePathname } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface ILoginResponse {
  jwt: string;
  refreshToken: string;
  user: User;
  role: number;
}

interface IUserProvider {
  user: RecursiveNormalize<IClients> | undefined;
  setUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
  isAuthenticated: boolean;
  logout: () => void;
  role: number | undefined;
  setRole: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface ChildrenProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IUserProvider);

const AuthProvider = ({ children }: ChildrenProps) => {
  const [userId, setUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<number>();
  const pathname = usePathname();

  const userParams = {
    'filters[users][id]': userId,
    populate: ['users.image', 'enterprise'],
  };

  const { data: user } = useQuery({
    queryKey: ['userData', userParams],
    queryFn: async () => {
      const data = await getClients(userParams);
      const result = normalizeStrapi(data || []);
      return result?.[0];
    },
    enabled: !!userId && userId !== 0,
  });

  useEffect(() => {
    const dataUser = localStorage.getItem(localStorageKeys.user);
    const roleUser = localStorage.getItem(localStorageKeys.role);

    if (roleUser) {
      setRole(Number(roleUser));
    }

    if (dataUser) {
      const usr = JSON.parse(dataUser) as User;
      setUserId(usr.id ? Number(usr.id) : 0);
    }

    setLoading(false);
  }, []);

  const isAuthenticated = !!userId;

  const logout = () => {
    localStorage.removeItem(localStorageKeys.user);
    localStorage.removeItem(localStorageKeys.role);
    localStorage.removeItem(localStorageKeys.accessToken);
    localStorage.removeItem(localStorageKeys.refreshToken);

    setUserId(undefined);
  };

  const publicRoutes = ['/'];

  if (loading) {
    return null;
  }

  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    redirect('/');
  }

  return (
    <AuthContext.Provider
      value={{ user, setUserId, isAuthenticated, logout, role, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
