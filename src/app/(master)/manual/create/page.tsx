'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import ManualForm from '@/components/forms/ManualForm/ManualForm';
import { useRouter } from 'next/navigation';

const ManualRegisterPage = () => {
  const { back } = useRouter();

  return (
    <PageLayout title="Cadastro de manual" backButton backFunction={back}>
      <ManualForm />
    </PageLayout>
  );
};

export default ManualRegisterPage;
