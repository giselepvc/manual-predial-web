import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { ITitleForm, TitleSchema } from '@/validations/TitleSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { IManualForm } from '@/validations/ManualSchema';
import { typeList } from '@/components/ManualTable/ManualTable';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { IManualList, TitlesDatum } from '@/interfaces/manual';
import { useState } from 'react';
import api from '@/services/api';
import { useQueryClient } from '@tanstack/react-query';
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
  title: RecursiveNormalize<TitlesDatum> | undefined;
}

const TitleForm = ({ onClose, control, manual, title }: ChapterPageProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEditing = !!title?.id;

  const {
    control: controlTitle,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITitleForm>({
    resolver: yupResolver(TitleSchema),
    defaultValues: {
      ...(isEditing && {
        title: title?.title,
        order: title?.order?.toString(),
        visible: {
          label: title?.visible ? 'Sim' : 'Não',
          value: title?.visible ? 'sim' : 'nao',
        },
      }),
    },
  });

  const onSubmit: SubmitHandler<ITitleForm> = async form => {
    try {
      setIsLoading(true);
      const formData = {
        ...form,
        title: form.title.toUpperCase(),
        description: '',
        order: Number(form.order),
        chapter: undefined,
        visible: form.visible?.value === 'sim',
      };

      const { data } = title?.id
        ? await api.put<any>(`/titles/${title?.id}`, { data: formData })
        : await api.post<any>('/titles', { data: formData });

      if (data.data?.id && form?.chapter?.value) {
        const chapterId = Number(form.chapter.value);
        const chptr = manual?.capters?.find(c => c?.id === chapterId);
        const chapterIds = chptr?.titles?.map(ttls => ttls?.id) || [];
        await api.put(`/capters/${form?.chapter?.value}`, {
          data: { titles: [...chapterIds, data.data.id] },
        });
      }

      if (isEditing) handleSuccess('Título editado com sucesso.');
      else handleSuccess('Título cadastrado com sucesso.');
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
      <RegisterTitle>
        {isEditing ? 'Editar título' : 'Cadastro de título'}
      </RegisterTitle>

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
                width="230px"
                options={typeList}
                isDisabled
              />
            )}
          />
        </Field>

        <Field>
          <Label>Capítulo</Label>
          <Controller
            control={controlTitle}
            name="chapter"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um capítulo"
                onChange={onChange}
                value={value}
                width="230px"
                options={
                  manual?.capters?.map(chapter => ({
                    label: chapter?.title || '',
                    value: `${chapter?.id || ''}`,
                  })) || []
                }
                isDisabled={isEditing}
              />
            )}
          />
          {errors?.chapter?.value?.message && (
            <ErrorMessage>{errors.chapter.value.message}</ErrorMessage>
          )}
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
          <Label>Visível?</Label>
          <Controller
            control={controlTitle}
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
      </FormSection>

      <FormSection
        style={{
          gridTemplateColumns: '1fr',
        }}
      >
        <Field style={{ maxWidth: '100%' }}>
          <Label>Nome do título</Label>
          <Input
            placeholder="Insira um nome"
            style={{ width: '965px', textTransform: 'uppercase' }}
            {...register('title')}
          />
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text={isEditing ? 'Editar' : 'Cadastrar'}
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default TitleForm;
