'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleSuccess } from '@/utils/handleToast';
import { ContainerSchema, IContainerForm } from '@/validations/ContainerSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
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
}

const ContainerForm = ({ onClose }: ChapterPageProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IContainerForm>({
    resolver: yupResolver(ContainerSchema),
    defaultValues: {
      type: {
        label: 'Capítulo',
        value: 'capitulo',
      },
    },
  });

  const onSubmit: SubmitHandler<IContainerForm> = form => {
    console.log(form);

    handleSuccess('Container cadastrado com sucesso.');

    onClose();
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
                placeholder="Capítulo"
                onChange={onChange}
                value={value}
                width="210px"
                options={[
                  {
                    label: 'Capítulo',
                    value: 'capitulo',
                  },
                ]}
                isDisabled
              />
            )}
          />
          {errors?.type?.value?.message && (
            <ErrorMessage>{errors.type.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Capítulo</Label>
          <Controller
            control={control}
            name="chapter"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um capítulo"
                onChange={onChange}
                value={value}
                width="210px"
                options={[
                  {
                    label: 'Capítulo 1',
                    value: 'capitulo 1',
                  },
                  {
                    label: 'Capítulo 2',
                    value: 'capitulo 2',
                  },
                ]}
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
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um título"
                onChange={onChange}
                value={value}
                width="210px"
                options={[
                  {
                    label: 'Título 1',
                    value: 'Título 1',
                  },
                  {
                    label: 'Título 2',
                    value: 'Título 2',
                  },
                ]}
              />
            )}
          />
          {errors?.title?.value?.message && (
            <ErrorMessage>{errors.title.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ maxWidth: '210px', minWidth: '210px' }}
            {...register('title')}
          />
        </Field>
      </FormSection>

      <FormSection>
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
                width="210px"
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
            name="visible"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma opção"
                onChange={onChange}
                value={value}
                width="210px"
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
                    label: 'Imagem unica com legenda abaixo paragrafo multiplo',
                    value: 'image',
                  },
                  {
                    label: 'Paragrafo - par de chaves',
                    value: 'pdf',
                  },
                  {
                    label: 'Paragrafo multiplo',
                    value: 'pdf',
                  },
                  {
                    label: 'Paragrafo multiplo itens não numerados',
                    value: 'pdf',
                  },
                  {
                    label: 'Paragrafo unico',
                    value: 'pdf',
                  },
                ]}
              />
            )}
          />
          {errors?.visible?.value?.message && (
            <ErrorMessage>{errors.visible.value.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Cadastrar"
          type="button"
          onClick={handleSubmit(onSubmit)}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ContainerForm;
