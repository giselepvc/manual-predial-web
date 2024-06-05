import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useQueryClient } from '@tanstack/react-query';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { AbaSchema, IAbaForm } from '@/validations/AbaSchema';
import { ContentsDatum } from '@/interfaces/manual';
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
  content: RecursiveNormalize<ContentsDatum> | undefined;
}

const AbasForm = ({ onClose, content }: ChapterPageProps) => {
  const query = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAbaForm>({
    resolver: yupResolver(AbaSchema),
    defaultValues: {
      description: content?.description || '',
      title: content?.title || '',
      order: content?.order,
      visible: content?.visible
        ? { label: 'Sim', value: 'sim' }
        : { label: 'Não', value: 'nao' } || { label: 'Sim', value: 'sim' },
      icon: 0,
    },
  });

  const onSubmit: SubmitHandler<IAbaForm> = async form => {
    try {
      await api.put(`/containers/${content?.id}`, {
        data: {
          title: form.title,
          order: form.order,
          visible: form.visible?.value === 'sim',
        },
      });

      handleSuccess('Conteúdo alterado com sucesso.');
      query.invalidateQueries({ queryKey: ['manualForm'] });
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastro de Aba</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ width: '300px' }}
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
                width="300px"
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
          <Label>Tipo selecionado</Label>
          <Input
            placeholder="Tipo selecionado"
            style={{ width: '300px' }}
            {...register('title')}
            disabled
          />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button text="Editar" type="button" onClick={handleSubmit(onSubmit)} />
      </ButtonSection>
    </RegisterForm>
  );
};

export default AbasForm;
