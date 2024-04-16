'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import CompanyForm from '@/components/forms/CompanyForm/CompanyForm';
import { useRouter } from 'next/router';

const CreateCompanyPage = () => {
  const router = useRouter();
  const param = router.query;

  return (
    <PageLayout title="Editar construtora">
      <CompanyForm isEditing companyId={(param?.id as string) || ''} />
    </PageLayout>
  );
};

export default CreateCompanyPage;
