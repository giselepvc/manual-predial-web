'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';

const ManualPage = () => {
  return (
    <PageLayout title="Listagem de manuais">
      <Action title="Cadastrar novo manual" />
    </PageLayout>
  );
};

export default ManualPage;
