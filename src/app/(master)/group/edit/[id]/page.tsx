'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import GroupForm from '@/components/forms/GroupForm/GroupForm';
import { useRouter } from 'next/router';

const EditGroupPage = () => {
  const router = useRouter();
  const param = router.query;

  return (
    <PageLayout title="Editar grupo">
      <GroupForm isEditing groupId={(param?.id as string) || ''} />
    </PageLayout>
  );
};

export default EditGroupPage;
