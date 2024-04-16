'use client';

import PageLayout from '@/components/PageLayout/PageLayout';
import SettingsForm from '@/components/forms/SettingsForm/SettingsForm';

const ConfigPage = () => {
  return (
    <PageLayout title="Configurações">
      <SettingsForm />
    </PageLayout>
  );
};

export default ConfigPage;
