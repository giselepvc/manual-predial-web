'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import ManualForm from '@/components/forms/ManualForm/ManualForm';
import { useAuth } from '@/hooks/useAuth';

const ManualEditPage = () => {
  const { role } = useAuth();
  const isCompany = role === 1;

  return (
    <PageLayout title={isCompany ? 'Detalhes do manual' : 'Edição de manual'}>
      <ManualForm editing />
    </PageLayout>
  );
};

export default ManualEditPage;
