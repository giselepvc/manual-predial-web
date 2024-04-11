'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { IManualForm, ManualSchema } from '@/validations/ManualSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { IManualList, ITitleList } from '@/interfaces/manual';
import ManualTable from '@/components/ManualTable/ManualTable';
import ContainerForm from '../ContainerForm/ContainerForm';
import TitleForm from '../TitleForm/TitleForm';
import ChapterForm from '../ChapterForm/ChapterForm';
import FirstForm from '../FirstForm/FirstForm';
import { RegisterForm } from './styles';
import AbasForm from '../AbasForm/AbasForm';

const ManualForm = () => {
  const [steps, setSteps] = useState<number>(0);
  const [cap, setCap] = useState<IManualList | undefined>();
  const [title, setTitle] = useState<ITitleList | undefined>();

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IManualForm>({
    resolver: yupResolver(ManualSchema),
  });

  const onSubmit: SubmitHandler<IManualForm> = form => {
    console.log(form);
    setSteps(1);
  };

  useEffect(() => {
    switch (watch('type.value')) {
      case 'capitulo':
        setSteps(2);
        break;

      case 'titulo':
        setSteps(3);
        break;

      case 'container':
        setSteps(4);
        break;

      default:
        break;
    }
  }, [watch('type')]);

  const onClose = () => {
    setSteps(1);
    setValue('type', undefined as any);
  };

  return (
    <RegisterForm>
      {steps === 0 && (
        <FirstForm
          handleSubmit={handleSubmit}
          control={control}
          errors={errors}
          onSubmit={onSubmit}
          register={register}
        />
      )}

      {steps === 1 && watch('enterprise.value') && watch('name') && (
        <ManualTable
          control={control}
          watch={watch}
          cap={cap}
          setCap={setCap}
          setTitle={setTitle}
          title={title}
        />
      )}

      {steps === 2 && <ChapterForm onClose={onClose} />}

      {steps === 3 && <TitleForm onClose={onClose} />}

      {steps === 4 && <ContainerForm onClose={onClose} />}

      {steps === 5 && <AbasForm onClose={onClose} />}
    </RegisterForm>
  );
};

export default ManualForm;
