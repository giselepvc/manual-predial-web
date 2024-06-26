'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import { ContentsDatum } from '@/interfaces/manual';
import { SubContentSchema, IContentForm } from '@/validations/SubContentSchema';

import { normalizeStrapi } from '@/utils/normalizeStrapi';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { RecursiveNormalize as R } from '@/utils/normalizeStrapi';
import api from '@/services/api';
import { getContents } from '@/services/querys/content';

import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import ContentList from './components/ContentList/ContentList';

import {
  ButtonSection,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  RegisterForm,
  RegisterTitle,
} from './styles';

interface ChapterPageProps {
  content: R<ContentsDatum> | undefined;
  onClose: () => void;
  setBuildType: Dispatch<SetStateAction<string>>;
  setSteps: Dispatch<SetStateAction<number>>;
  setContent: Dispatch<SetStateAction<R<ContentsDatum> | undefined>>;
}

const SubContentForm = ({
  content,
  onClose,
  setContent,
  setBuildType,
  setSteps,
}: ChapterPageProps) => {
  const query = useQueryClient();

  const [deletingId, setDeletingId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IContentForm>({
    resolver: yupResolver(SubContentSchema),
    defaultValues: {
      visible: { label: 'Sim', value: 'sim' },
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

  const onSubmit: SubmitHandler<IContentForm> = async form => {
    try {
      setIsLoading(true);
      const { data } = await api.post<{ data: { id: number } }>('/containers', {
        data: {
          order: Number(form.order),
          visible: form.visible?.value === 'sim',
          type: form.container?.value,
        },
      });

      if (data.data?.id && container?.id) {
        const contentIds = container?.sub_containers?.map(c => c?.id) || [];
        await api.put(`/containers/${container.id}`, {
          data: { sub_containers: [...contentIds, data.data.id], type: 'abas' },
        });
      }

      setValue('order', '');
      setValue('visible', { label: 'Sim', value: 'sim' });
      handleSuccess('Conteúdo cadastrado com sucesso.');
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
      <RegisterTitle>
        Listagem de conteúdo em {`"${content?.title}"`}
      </RegisterTitle>

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
          <Label>Tipo do container</Label>
          <Controller
            control={control}
            name="container"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma opção"
                onChange={onChange}
                value={value}
                width="300px"
                options={[
                  { label: 'Arquivo PDF', value: 'pdf' },
                  {
                    label: 'Imagem única com legenda abaixo parágrafo múltiplo',
                    value: 'image',
                  },
                  { label: 'Parágrafo único ou múltiplo', value: 'paragraph' },
                  {
                    label: 'Parágrafos - tópicos com ícones',
                    value: 'paragraphIcon',
                  },
                ]}
              />
            )}
          />
          {errors?.container?.value?.message && (
            <ErrorMessage>{errors.container.value.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Adicionar"
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>

      <ContentList
        container={container}
        setContent={setContent}
        setSteps={setSteps}
        setBuildType={setBuildType}
        setDeletingId={setDeletingId}
      />

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

export default SubContentForm;
