'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import CustomerForm from '@/components/forms/CustomerForm/CustomerForm';

const UserRegisterPage = () => {
  return (
    <PageLayout title="Cadastro de usuário empreendimento">
      <CustomerForm />
    </PageLayout>
  );
};

export default UserRegisterPage;
