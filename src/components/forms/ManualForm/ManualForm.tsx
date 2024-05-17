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
  ContentsDatum,
} from '@/interfaces/manual';
import ManualTable from '@/components/ManualTable/ManualTable';
import handleError from '@/utils/handleToast';
import api from '@/services/api';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getManuals } from '@/services/querys/manual';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { getEnterprise } from '@/services/querys/enterprise';
import { useAuth } from '@/hooks/useAuth';
import ManualDetails from '@/components/ManualDetails/ManualDetails';
import { IContent } from '@/interfaces/content';
import ContainerForm from '../ContainerForm/ContainerForm';
import TitleForm from '../TitleForm/TitleForm';
import ChapterForm from '../ChapterForm/ChapterForm';
import FirstForm from '../FirstForm/FirstForm';
import { RegisterForm } from './styles';
import AbasForm from '../AbasForm/AbasForm';
import ImageForm from '../ImageForm/ImageForm';
import FileForm from '../FileForm/FileForm';
import ParagraphForm from '../ParagraphForm/ParagraphForm';
import ContentForm from '../ContentForm/ContentForm';
import SubContentForm from '../SubContentForm/SubContentForm';

interface ManualFormProps {
  editing?: boolean;
}

const ManualForm = ({ editing }: ManualFormProps) => {
  const param = useParams();
  const { role } = useAuth();
  const isCompany = role === 1;
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(editing ? 1 : 0);
  const [buildType, setBuildType] = useState<string>('');
  const [chapter, setChapter] = useState<
    RecursiveNormalize<CaptersDatum> | undefined
  >();
  const [title, setTitle] = useState<
    RecursiveNormalize<TitlesDatum> | undefined
  >();
  const [manual, setManual] = useState<
    RecursiveNormalize<IManualList> | undefined
  >();
  const [content, setContent] = useState<
    RecursiveNormalize<ContentsDatum> | undefined
  >();
  const [subcontent, setSubcontent] = useState<
    RecursiveNormalize<ContentsDatum> | undefined
  >();
  const [abacontent, setAbacontent] = useState<
    RecursiveNormalize<IContent> | undefined
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
    'populate[0]': 'capters.titles.containers.image',
    'populate[1]': 'enterprise',
    'populate[3]': 'capters.icon.image',
    'populate[4]': 'capters.titles.containers.pdf',
    'populate[5]': 'capters.titles.containers.icon.image',
    'populate[6]': 'capters.groups',
    'filters[id]': param?.id || manual?.id,
  };

  useQuery({
    queryKey: ['manualForm', manualsParams],
    queryFn: async () => {
      const data = await getManuals(manualsParams);
      const results = normalizeStrapi(data || []);
      const result = results?.[0];
      setValue('enterprise', {
        value: result?.enterprise?.id?.toString() || '',
        label: result?.enterprise?.title || '',
      });
      setValue('name', result?.title || '');
      setManual(result);
      setSteps(1);
      return results;
    },
    enabled: (!!param?.id && editing) || !!manual?.id,
  });

  const enterpriseParams = {
    'sort[createdAt]': 'DESC',
    'filters[manuals][id]': param?.id || manual?.id,
    populate: ['manuals'],
  };

  const { data: enterprise } = useQuery({
    queryKey: ['enterpriseData', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      return normalizeStrapi(data || []);
    },
  });

  const onSubmit: SubmitHandler<IManualForm> = async form => {
    try {
      setIsloading(true);
      const { data } = await api.post<ResponseManual>('/manuals', {
        data: {
          title: form.name,
          description: form.enterprise?.value || '',
          visible: true,
        },
      });

      if (data.data?.id && form.enterprise?.value) {
        const etpId = form.enterprise.value;
        const enterpriseFind = enterprise?.find(e => e.id === Number(etpId));
        const manualsIds = enterpriseFind?.manuals?.map(item => item.id) || [];
        await api.put(`/enterprises/${etpId}`, {
          data: { manuals: [...manualsIds, data.data.id] },
        });
      }

      setManual({
        ...data.data.attributes,
        id: data.data.id,
        enterprise: {} as any,
        capters: [],
      });
      setSteps(1);
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (watch('type.value') === undefined) return;
    if (
      watch('type.value') === 'personalizado' ||
      watch('type.value') === 'default'
    ) {
      setChapter(undefined);
      setSteps(2);
    }
    if (watch('type.value') === 'titulo') {
      setTitle(undefined);
      setSteps(3);
    }
    if (watch('type.value') === 'container') {
      setContent(undefined);
      setSteps(4);
    }
  }, [watch('type')]);

  const onClose = () => {
    setSteps(1);
    setBuildType('');
    setValue('type', undefined as any);
  };

  const onCloseSubContainer = () => {
    if (subcontent?.id) {
      setSteps(5);
      setBuildType('subcontainer');
      setContent(subcontent);
    }

    setSteps(1);
    setBuildType('');
    setValue('type', undefined as any);
  };

  const builder = {
    abas: <AbasForm onClose={onCloseSubContainer} content={content} />,
    pdf: <FileForm onClose={onCloseSubContainer} content={content} />,
    image: <ImageForm onClose={onCloseSubContainer} content={content} />,
    paragraph: (
      <ParagraphForm onClose={onCloseSubContainer} content={content} />
    ),
    paragraphIcon: (
      <ParagraphForm onClose={onCloseSubContainer} content={content} />
    ),
    keys: <ParagraphForm onClose={onCloseSubContainer} content={content} />,
    content: (
      <ContentForm
        onClose={onClose}
        content={content}
        setBuildType={setBuildType}
        setContent={setContent}
        setSteps={setSteps}
        setSubContent={setSubcontent}
        setAbaContent={setAbacontent}
      />
    ),
    subcontainer: (
      <SubContentForm
        onClose={() => {
          setSteps(5);
          setBuildType('content');
          setContent(abacontent);
        }}
        content={content}
        setBuildType={setBuildType}
        setContent={setContent}
        setSteps={setSteps}
      />
    ),
  } as any;

  return (
    <RegisterForm>
      {steps === 0 && (
        <FirstForm
          handleSubmit={handleSubmit}
          control={control}
          errors={errors}
          onSubmit={onSubmit}
          register={register}
          isLoading={isLoading}
          watch={watch}
        />
      )}
      {steps === 1 && !isCompany && (
        <ManualTable
          control={control}
          watch={watch}
          cap={chapter}
          title={title}
          manual={manual}
          setCap={setChapter}
          setTitle={setTitle}
          setContent={setContent}
          setSteps={setSteps}
          setBuildType={setBuildType}
        />
      )}
      {steps === 1 && isCompany && (
        <ManualDetails
          watch={watch}
          cap={chapter}
          title={title}
          manual={manual}
          setCap={setChapter}
          setTitle={setTitle}
        />
      )}
      {steps === 2 && (
        <ChapterForm
          onClose={onClose}
          manual={manual}
          chapter={chapter}
          type={watch('type.value') || ''}
        />
      )}
      {steps === 3 && (
        <TitleForm
          control={control}
          onClose={onClose}
          manual={manual}
          title={title}
        />
      )}
      {steps === 4 && (
        <ContainerForm control={control} onClose={onClose} manual={manual} />
      )}
      {steps === 5 && builder[buildType]}
    </RegisterForm>
  );
};

export default ManualForm;
