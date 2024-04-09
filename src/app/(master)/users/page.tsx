'use client';

import Action from '@/components/Action/Action';
import PageLayout from '@/components/PageLayout/PageLayout';

const UsersPage = () => {
  return (
    <PageLayout title="Listagem de usuários">
      <Action title="Cadastrar novo usuário" />
    </PageLayout>
  );
};

export default UsersPage;
