'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { IManualForm, ManualSchema } from '@/validations/ManualSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import {
  IManualList,
  TitlesDatum,
  ResponseManual,
  CaptersDatum,
} from '@/interfaces/manual';
import ManualTable from '@/components/ManualTable/ManualTable';
import handleError from '@/utils/handleToast';
import api from '@/services/api';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getManuals } from '@/services/querys/manual';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import ContainerForm from '../ContainerForm/ContainerForm';
import TitleForm from '../TitleForm/TitleForm';
import ChapterForm from '../ChapterForm/ChapterForm';
import FirstForm from '../FirstForm/FirstForm';
import { RegisterForm } from './styles';
import AbasForm from '../AbasForm/AbasForm';

interface ManualFormProps {
  editing?: boolean;
}

const ManualForm = ({ editing }: ManualFormProps) => {
  const param = useParams();

  const [steps, setSteps] = useState<number>(editing ? 1 : 0);
  const [cap, setCap] = useState<
    RecursiveNormalize<CaptersDatum> | undefined
  >();
  const [title, setTitle] = useState<
    RecursiveNormalize<TitlesDatum> | undefined
  >();
  const [manual, setManual] = useState<
    RecursiveNormalize<IManualList> | undefined
  >();

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

  const manualsParams = {
    'populate[0]': 'capters.titles.contents',
    'populate[1]': 'enterprise',
    'filters[id]': param?.id,
  };

  useQuery({
    queryKey: ['myItems', manualsParams],
    queryFn: async () => {
      const { data } = await getManuals(manualsParams);
      const results = normalizeStrapi(data || []);

      setValue('enterprise', {
        value: results?.[0]?.enterprise?.title || '',
        label: results?.[0]?.enterprise?.title || '',
      });
      setValue('name', results?.[0]?.title || '');
      setManual(results?.[0]);
      setSteps(1);
    },
    enabled: !!param?.id && !!editing,
  });

  const onSubmit: SubmitHandler<IManualForm> = async form => {
    try {
      const { data } = await api.post<ResponseManual>('/manuals', {
        data: {
          title: form.name,
          description: form.enterprise?.value || '',
          visible: true,
        },
      });

      setManual({
        ...data.data?.attributes,
        id: data.data?.id,
        enterprise: {} as any,
        capters: [],
      });
      setSteps(1);
    } catch (error: any) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (watch('type.value')) {
      const stepTypes = {
        capitulo: setSteps(2),
        titulo: setSteps(3),
        container: setSteps(4),
      } as any;

      return stepTypes[watch('type.value') || ''];
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

      {steps === 1 && (
        <ManualTable
          control={control}
          watch={watch}
          cap={cap}
          setCap={setCap}
          setTitle={setTitle}
          title={title}
          manual={manual}
        />
      )}

      {steps === 2 && <ChapterForm control={control} onClose={onClose} />}
      {steps === 3 && <TitleForm control={control} onClose={onClose} />}
      {steps === 4 && <ContainerForm control={control} onClose={onClose} />}
      {steps === 5 && <AbasForm onClose={onClose} />}
    </RegisterForm>
  );
};

export default ManualForm;
