'use client';

import { PropsWithChildren } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/Loading/Loading';
import { MasterLayoutContainer, MasterLayoutContent } from './styles';

const MasterLayout = ({ children }: PropsWithChildren) => {
  const { role, isloading } = useAuth();
  const isViewer = role === 4;

  return (
    <MasterLayoutContainer>
      {!isViewer && <Navbar />}
      {isloading && <Loading />}
      <MasterLayoutContent>{children}</MasterLayoutContent>
    </MasterLayoutContainer>
  );
};

export default MasterLayout;
