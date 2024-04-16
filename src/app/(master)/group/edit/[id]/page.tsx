'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import GroupForm from '@/components/forms/GroupForm/GroupForm';
import { useParams } from 'next/navigation';

const EditGroupPage = () => {
  const param = useParams();

  return (
    <PageLayout title="Editar grupo">
      <GroupForm isEditing groupId={(param?.id as string) || ''} />
    </PageLayout>
  );
};

export default EditGroupPage;
