'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';

const EnterprisePage = () => {
  return (
    <PageLayout title="Listagem de emprendimento">
      <Action title="Cadastrar novo emprendimento" />
    </PageLayout>
  );
};

export default EnterprisePage;
