'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import GroupForm from '@/components/forms/GroupForm/GroupForm';

const CreateGroupPage = () => {
  return (
    <PageLayout title="Cadastro de grupo">
      <GroupForm />
    </PageLayout>
  );
};

export default CreateGroupPage;
