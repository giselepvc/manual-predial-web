'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import handleError, { handleSuccess } from '@/utils/handleToast';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { ContentsDatum } from '@/interfaces/manual';
import { Dispatch, SetStateAction, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { getContents } from '@/services/querys/content';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import { ContentSchema, IContentForm } from '@/validations/ContentSchema';
import { getIcons } from '@/services/querys/icons';
import Image from 'next/image';
import { urlBuild } from '@/utils/urlBuild';
import { IContent } from '@/interfaces/content';
import ContentList from './components/ContentList/ContentList';
import {
  ButtonSection,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  RadiosRow,
  RegisterForm,
  RegisterTitle,
} from './styles';

interface Response {
  data: { id: number };
}

interface ChapterPageProps {
  onClose: () => void;
  content: Recursive<ContentsDatum> | undefined;
  setBuildType: Dispatch<SetStateAction<string>>;
  setSteps: Dispatch<SetStateAction<number>>;
  setContent: Dispatch<SetStateAction<Recursive<ContentsDatum> | undefined>>;
  setSubContent: Dispatch<SetStateAction<Recursive<ContentsDatum> | undefined>>;
  setAbaContent: Dispatch<SetStateAction<Recursive<IContent> | undefined>>;
}

const ContentForm = ({
  onClose,
  content,
  setContent,
  setBuildType,
  setSubContent,
  setAbaContent,
  setSteps,
}: ChapterPageProps) => {
  const query = useQueryClient();
  const [deletingId, setDeletingId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentId, setContentId] = useState<number | undefined>();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContentForm>({
    resolver: yupResolver(ContentSchema),
  });

  const iconsParams = {
    populate: '*',
    'pagination[page]': 1,
    'pagination[pageSize]': 100,
    'filters[active]': true,
  };

  const { data: icons } = useQuery({
    queryKey: ['iconsData', iconsParams],
    queryFn: async () => {
      const result = await getIcons(iconsParams);
      const iconsResult = normalizeStrapi(result || []);
      iconsResult.sort((a, b) => a.id - b.id);
      return iconsResult;
    },
  });

  const contentsParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id]': content?.id,
    populate: [
      'sub_containers.pdf',
      'sub_containers.icon.image',
      'container',
      'sub_containers.image',
      'icon.image',
      'pdf',
      'image',
    ],
  };

  const { data: container } = useQuery({
    queryKey: ['contentsData', contentsParams],
    queryFn: async () => {
      const data = await getContents(contentsParams);
      const contents = normalizeStrapi(data || []);
      return contents?.[0];
    },
    enabled: !!content?.id,
  });

  const onClear = () => {
    reset({
      order: '',
      visible: { label: 'Sim', value: 'sim' },
      description: '',
      title: '',
      icon: 0,
    });
  };

  const onSubmit: SubmitHandler<IContentForm> = async form => {
    try {
      setIsLoading(true);
      const data = {
        title: form.title,
        subtitle: form.description?.toUpperCase(),
        order: Number(form.order),
        visible: form.visible?.value === 'sim',
        icon: form?.icon === 0 ? undefined : form?.icon,
        type: 'abas',
      };

      const { data: result } = contentId
        ? await api.put<Response>(`/containers/${contentId}`, { data })
        : await api.post<Response>('/containers', { data });

      if (result.data?.id && container?.id) {
        const contentIds = container?.sub_containers?.map(c => c?.id) || [];
        await api.put(`/containers/${container.id}`, {
          data: { sub_containers: [...contentIds, result.data.id] },
        });
      }

      setContentId(undefined);
      onClear();
      if (contentId) {
        handleSuccess('Conteúdo alterado com sucesso.');
      } else {
        handleSuccess('Conteúdo cadastrado com sucesso.');
      }
      query.invalidateQueries({ queryKey: ['contentsData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deletingId) return;
    try {
      setIsLoading(true);
      await api.delete(`/containers/${deletingId}`);
      handleSuccess('Conteúdo deletado com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['contentsData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm>
      <RegisterTitle>Listagem de titulos nas Abas</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ width: '230px' }}
            {...register('order')}
          />
          {errors?.order?.message && (
            <ErrorMessage>{errors.order.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Visível?</Label>
          <Controller
            control={control}
            name="visible"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma opção"
                onChange={onChange}
                value={value}
                width="230px"
                options={[
                  { label: 'Sim', value: 'sim' },
                  { label: 'Não', value: 'nao' },
                ]}
              />
            )}
          />
          {errors?.visible?.value?.message && (
            <ErrorMessage>{errors.visible.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Título</Label>
          <Input
            placeholder="Insira um título"
            type="text"
            style={{ width: '230px' }}
            {...register('title')}
          />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Legenda</Label>
          <Input
            placeholder="Insira uma legenda"
            style={{ width: '230px', textTransform: 'uppercase' }}
            {...register('description')}
          />
          {errors?.description?.message && (
            <ErrorMessage>{errors.description.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Selecione um ícone</Label>
          <RadiosRow>
            <CheckboxLabel>
              <Checkbox type="radio" {...register('icon')} value={0} />
              Nenhum
            </CheckboxLabel>
            {icons?.map(item => (
              <CheckboxLabel>
                <Checkbox type="radio" {...register('icon')} value={item.id} />
                <Image
                  src={urlBuild(item.image?.url)}
                  alt="icons"
                  width={14}
                  height={14}
                />
              </CheckboxLabel>
            ))}
          </RadiosRow>
          {errors?.icon?.message && (
            <ErrorMessage>{errors.icon.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button
          outlined
          text="Voltar"
          type="button"
          onClick={() => {
            if (contentId) {
              setContentId(undefined);
              onClear();
            } else {
              onClose();
            }
          }}
        />
        <Button
          text={contentId ? 'Editar' : 'Adicionar'}
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>

      {!contentId && (
        <ContentList
          container={container}
          setContent={setContent}
          setSteps={setSteps}
          setBuildType={setBuildType}
          setDeletingId={setDeletingId}
          setSubContent={setSubContent}
          setAbaContent={setAbaContent}
          setContentId={setContentId}
          reset={reset}
        />
      )}

      {deletingId && (
        <ConfirmModal
          title="Atenção"
          onClose={() => setDeletingId(undefined)}
          onConfirm={onDelete}
          onCancel={() => setDeletingId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          isLoading={isLoading}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>excluir</strong> esse conteúdo?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </RegisterForm>
  );
};

export default ContentForm;
