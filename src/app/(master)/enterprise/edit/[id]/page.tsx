'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import EnterpriseForm from '@/components/forms/EnterpriseForm/EnterpriseForm';
import { useParams } from 'next/navigation';

const EditEnterprisePage = () => {
  const param = useParams();

  return (
    <PageLayout title="Editar empreendimento">
      <EnterpriseForm companyId={(param?.id as string) || ''} isEditing />
    </PageLayout>
  );
};

export default EditEnterprisePage;
