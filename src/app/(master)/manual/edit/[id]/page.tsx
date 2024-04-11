'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import ManualForm from '@/components/forms/ManualForm/ManualForm';
import { useRouter } from 'next/navigation';

const ManualEditPage = () => {
  const { back } = useRouter();

  return (
    <PageLayout title="Edição de manual" backButton backFunction={back}>
      <ManualForm editing />
    </PageLayout>
  );
};

export default ManualEditPage;
