'use client';

import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { ContainerSchema, IContainerForm } from '@/validations/ContainerSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { IManualForm } from '@/validations/ManualSchema';
import { typeList } from '@/components/ManualTable/ManualTable';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { IManualList, Titles } from '@/interfaces/manual';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
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
  onClose: () => void;
  control: Control<IManualForm, any>;
  manual: RecursiveNormalize<IManualList> | undefined;
}

const ContainerForm = ({ onClose, control, manual }: ChapterPageProps) => {
  const query = useQueryClient();

  const [titlesList, setTitles] = useState<RecursiveNormalize<Titles>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control: controlContainer,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IContainerForm>({
    resolver: yupResolver(ContainerSchema),
    defaultValues: {
      visible: { label: 'Sim', value: 'sim' },
    },
  });

  useEffect(() => {
    if (watch('chapter.value')) {
      const chapter = manual?.capters?.find(
        chapter => chapter?.id === Number(watch('chapter.value')),
      );
      setTitles(chapter?.titles || []);
    }
  }, [watch('chapter')]);

  const onSubmit: SubmitHandler<IContainerForm> = async form => {
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

      if (data.data?.id && form?.title?.value && form?.chapter?.value) {
        const chapter = manual?.capters?.find(
          capter => capter?.id === Number(form.chapter.value),
        );
        const title = chapter?.titles?.find(
          title => title?.id === Number(form.title.value),
        );
        const titlesContentsIds =
          title?.containers?.map(content => content?.id) || [];

        await api.put(`/titles/${form?.title?.value}`, {
          data: {
            containers: [...titlesContentsIds, data.data.id],
          },
        });
      }

      handleSuccess('Container cadastrado com sucesso.');
      query.invalidateQueries({ queryKey: ['manualForm'] });
      onClose();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastro de conteúdo</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Tipo de cadastro</Label>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Tipo de cadastro"
                onChange={onChange}
                value={value}
                width="230px"
                options={typeList}
                isDisabled
              />
            )}
          />
        </Field>

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
          <Label>Capítulo</Label>
          <Controller
            control={controlContainer}
            name="chapter"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um capítulo"
                onChange={onChange}
                value={value}
                width="230px"
                zIndex={9999}
                options={
                  manual?.capters?.map(chapter => ({
                    label: chapter?.title || '',
                    value: `${chapter?.id || ''}`,
                  })) || []
                }
              />
            )}
          />
          {errors?.chapter?.value?.message && (
            <ErrorMessage>{errors.chapter.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Título</Label>
          <Controller
            control={controlContainer}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um título"
                onChange={onChange}
                value={value}
                width="230px"
                options={
                  titlesList?.map(title => ({
                    label: title?.title || '',
                    value: `${title?.id || ''}`,
                  })) || []
                }
              />
            )}
          />
          {errors?.title?.value?.message && (
            <ErrorMessage>{errors.title.value.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Visível?</Label>
          <Controller
            control={controlContainer}
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
            control={controlContainer}
            name="container"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma opção"
                onChange={onChange}
                value={value}
                width="230px"
                options={[
                  {
                    label: 'Abas',
                    value: 'abas',
                  },
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
          text="Cadastrar"
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ContainerForm;
