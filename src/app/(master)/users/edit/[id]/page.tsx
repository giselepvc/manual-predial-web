'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import CustomerForm from '@/components/forms/CustomerForm/CustomerForm';

const CustomerEditPage = () => {
  return (
    <PageLayout title="Editar usuário">
      <CustomerForm isEditing />
    </PageLayout>
  );
};

export default CustomerEditPage;
