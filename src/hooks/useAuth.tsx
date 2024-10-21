/* eslint-disable react/jsx-no-constructed-context-values */

'use client';

import { useContext, useEffect, useState } from 'react';
import { createContext, ReactNode } from 'react';
import { redirect, usePathname } from 'next/navigation';

import { IClients } from '@/interfaces/clients';

import { useClients } from '@/services/querys/clients';

import { localStorageKeys } from '@/utils/localStorageKeys';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { setupAxiosInterceptors } from '@/services/api';

export interface User {
  id: number;
  email: string;
  username: string;
}

export interface ILoginResponse {
  user: User;
  jwt: string;
  refreshToken: string;
  role: number;
}

interface IUserProvider {
  user: RecursiveNormalize<IClients> | undefined;
  role: number | undefined;
  isloading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
  setRole: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface ChildrenProps {
  children: ReactNode;
}

const AuthContext = createContext({} as IUserProvider);

const AuthProvider = ({ children }: ChildrenProps) => {
  const [userId, setUserId] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [role, setRole] = useState<number>();
  const pathname = usePathname();

  const userParams = {
    'filters[users][id]': userId,
    populate: [
      'users.image',
      'enterprise.company.image',
      'group.enterprise.image',
      'group.enterprise.company.image',
    ],
  };

  const requestEnadled = !!userId && userId !== 0;

  const { data: users } = useClients(userParams, requestEnadled);
  const user = users?.[0];

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

  useEffect(() => {
    setupAxiosInterceptors(setIsLoading);
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
      value={{
        user,
        setUserId,
        isAuthenticated,
        logout,
        role,
        setRole,
        isloading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
