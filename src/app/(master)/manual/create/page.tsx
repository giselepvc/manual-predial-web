'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import { useRouter } from 'next/navigation';
import ManualForm from '@/components/ManualForm/ManualForm';

const ManualRegisterPage = () => {
  const { back } = useRouter();

  return (
    <PageLayout title="Cadastro de manual" backButton backFunction={back}>
      <ManualForm />
    </PageLayout>
  );
};

export default ManualRegisterPage;
