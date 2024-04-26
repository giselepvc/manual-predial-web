'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import CustomerForm from '@/components/forms/CustomerForm/CustomerForm';
import { useParams } from 'next/navigation';

const CustomerEditPage = () => {
  const param = useParams();

  return (
    <PageLayout title="Editar usuário">
      <CustomerForm isEditing customerId={Number(param?.id as string)} />
    </PageLayout>
  );
};

export default CustomerEditPage;
