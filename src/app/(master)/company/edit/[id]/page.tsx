'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import CompanyForm from '@/components/forms/CompanyForm/CompanyForm';
import { useParams } from 'next/navigation';

const CreateCompanyPage = () => {
  const param = useParams();

  return (
    <PageLayout title="Editar construtora">
      <CompanyForm isEditing companyId={(param?.id as string) || ''} />
    </PageLayout>
  );
};

export default CreateCompanyPage;
