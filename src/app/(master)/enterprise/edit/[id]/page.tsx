'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import EnterpriseForm from '@/components/forms/EnterpriseForm/EnterpriseForm';
import { useRouter } from 'next/router';

const EditEnterprisePage = () => {
  const router = useRouter();
  const param = router.query;

  return (
    <PageLayout title="Editar empreendimento">
      <EnterpriseForm />
    </PageLayout>
  );
};

export default EditEnterprisePage;
