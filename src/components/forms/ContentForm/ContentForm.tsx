/* eslint-disable react/no-unescaped-entities */

'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import handleError, { handleSuccess } from '@/utils/handleToast';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { ContentsDatum } from '@/interfaces/manual';
import { Dispatch, SetStateAction, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { getContents } from '@/services/querys/content';
import { FaPen, FaTrash } from 'react-icons/fa6';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import { ContentSchema, IContentForm } from '@/validations/ContentSchema';
import {
  ButtonSection,
  Content,
  ErrorMessage,
  Field,
  FormSection,
  InfoSection,
  Label,
  RegisterForm,
  RegisterTitle,
  TableRow,
  TableSection,
} from './styles';

interface ChapterPageProps {
  onClose: () => void;
  content: RecursiveNormalize<ContentsDatum> | undefined;
  setContent: Dispatch<
    SetStateAction<RecursiveNormalize<ContentsDatum> | undefined>
  >;
  setBuildType: Dispatch<SetStateAction<string>>;
  setSteps: Dispatch<SetStateAction<number>>;
}

const ContentForm = ({
  onClose,
  content,
  setContent,
  setBuildType,
  setSteps,
}: ChapterPageProps) => {
  const query = useQueryClient();

  const [deletingId, setDeletingId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContentForm>({
    resolver: yupResolver(ContentSchema),
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

  const { data: contentsData } = useQuery({
    queryKey: ['contentsData', contentsParams],
    queryFn: async () => getContents(contentsParams),
    enabled: !!content?.id,
  });

  const contents = normalizeStrapi(contentsData || []);
  const container = contents?.[0];

  const onSubmit: SubmitHandler<IContentForm> = async form => {
    setIsLoading(true);

    try {
      const { data } = await api.post<{ data: { id: number } }>('/containers', {
        data: {
          title: form.container?.label,
          description: '',
          order: form.order,
          visible: form.visible?.value === 'sim',
          type: form.container?.value,
        },
      });

      if (data.data?.id && container?.id) {
        const contentIds =
          container?.sub_containers?.map(cont => cont?.id) || [];

        await api.put(`/containers/${container.id}`, {
          data: {
            sub_containers: [...contentIds, data.data.id],
          },
        });
      }

      reset({
        container: undefined,
        order: undefined,
        visible: undefined,
      });

      handleSuccess('Conteúdo cadastrado com sucesso.');
      query.invalidateQueries({ queryKey: ['contentsData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!deletingId) {
      return;
    }

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
      <RegisterTitle>Cadastro de conteúdo dentro da Aba</RegisterTitle>
      <RegisterTitle>"{content?.title || ''}"</RegisterTitle>

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
                  {
                    label: 'Sim',
                    value: 'sim',
                  },
                  {
                    label: 'Não',
                    value: 'nao',
                  },
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
                width="230px"
                options={[
                  {
                    label: 'Arquivo PDF',
                    value: 'pdf',
                  },
                  {
                    label: 'Imagem única com legenda abaixo parágrafo múltiplo',
                    value: 'image',
                  },
                  {
                    label: 'Parágrafo - par de chaves',
                    value: 'keys',
                  },
                  {
                    label: 'Parágrafo único ou múltiplo',
                    value: 'paragraph',
                  },
                  {
                    label: 'Parágrafo múltiplo itens não numerados',
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
          text="Cadastrar"
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>

      <Content>
        <TableSection>
          {container?.sub_containers?.map(content => (
            <TableRow>
              <InfoSection>
                <span>{content.order}</span>
                <div>{content.title}</div>
              </InfoSection>

              <div>
                <FaPen
                  onClick={() => {
                    setContent(content);
                    setSteps(5);
                    setBuildType(content.type);
                  }}
                />
                <FaTrash
                  onClick={() => !isLoading && setDeletingId(content.id)}
                />
              </div>
            </TableRow>
          ))}
        </TableSection>
      </Content>

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
            Tem certeza que deseja <strong>excluir</strong> o conteúdo nessa
            aba?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </RegisterForm>
  );
};

export default ContentForm;
