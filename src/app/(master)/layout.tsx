'use client';

import { PropsWithChildren } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { MasterLayoutContainer, MasterLayoutContent } from './styles';

const MasterLayout = ({ children }: PropsWithChildren) => {
  const { role } = useAuth();
  const isViewer = role === 4;

  return (
    <MasterLayoutContainer>
      {!isViewer && <Navbar />}
      <MasterLayoutContent>{children}</MasterLayoutContent>
    </MasterLayoutContainer>
  );
};

export default MasterLayout;
