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
import { IManualList } from '@/interfaces/manual';
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
}

const TitleForm = ({ onClose, control, manual }: ChapterPageProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    control: controlTitle,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITitleForm>({
    resolver: yupResolver(TitleSchema),
  });

  const onSubmit: SubmitHandler<ITitleForm> = async form => {
    setIsLoading(true);

    try {
      const { data } = await api.post<{ data: { id: number } }>('/titles', {
        data: {
          ...form,
          description: '',
          chapter: undefined,
          visible: form.visible?.value === 'sim',
        },
      });

      if (data.data?.id && form?.chapter?.value) {
        const chapter = manual?.capters?.find(
          capter => capter?.id === Number(form.chapter.value),
        );
        const chapterTitlesIds = chapter?.titles?.map(ttls => ttls?.id) || [];

        await api.put(`/capters/${form?.chapter?.value}`, {
          data: {
            titles: [...chapterTitlesIds, data.data.id],
          },
        });
      }

      handleSuccess('Título cadastrado com sucesso.');

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
      <RegisterTitle>Cadastro de título</RegisterTitle>

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
            style={{ width: '965px' }}
            {...register('title')}
          />
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

export default TitleForm;
