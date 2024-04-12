'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import CompanyForm from '@/components/forms/CompanyForm/CompanyForm';

const CreateCompanyPage = () => {
  return (
    <PageLayout title="Cadastro de construtora">
      <CompanyForm />
    </PageLayout>
  );
};

export default CreateCompanyPage;
