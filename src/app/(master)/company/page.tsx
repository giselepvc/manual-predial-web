'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';

const CompanyPage = () => {
  return (
    <PageLayout title="Listagem de construtora">
      <Action title="Cadastrar nova construtora" />
    </PageLayout>
  );
};

export default CompanyPage;
