'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import EnterpriseForm from '@/components/forms/EnterpriseForm/EnterpriseForm';

const CreateEnterprisePage = () => {
  return (
    <PageLayout title="Cadastro de empreendimento">
      <EnterpriseForm />
    </PageLayout>
  );
};

export default CreateEnterprisePage;
