'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import ManualForm from '@/components/forms/ManualForm/ManualForm';

const ManualRegisterPage = () => {
  return (
    <PageLayout title="Cadastro de manual">
      <ManualForm />
    </PageLayout>
  );
};

export default ManualRegisterPage;
