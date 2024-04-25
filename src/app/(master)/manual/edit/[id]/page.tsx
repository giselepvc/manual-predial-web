'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import ManualForm from '@/components/forms/ManualForm/ManualForm';

const ManualEditPage = () => {
  return (
    <PageLayout title="Edição de manual">
      <ManualForm editing />
    </PageLayout>
  );
};

export default ManualEditPage;
