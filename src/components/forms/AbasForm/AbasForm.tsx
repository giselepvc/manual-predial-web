/* eslint-disable prettier/prettier */
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import handleError, { handleSuccess } from '@/utils/handleToast';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getIcons } from '@/services/querys/icons';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import { AbaSchema, IAbaForm } from '@/validations/AbaSchema';
import { ContentsDatum } from '@/interfaces/manual';
import api from '@/services/api';
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
  TextArea,
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
        ? {
          label: 'Sim',
          value: 'sim',
        }
        : {
          label: 'Não',
          value: 'nao',
        },
      icon: 0,
    },
  });

  const iconsParams = {
    populate: '*',
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

  const onSubmit: SubmitHandler<IAbaForm> = async form => {
    try {
      const { data } = await api.put<{ data: { id: number } }>(
        `/containers/${content?.id}`,
        {
          data: {
            title: form.title,
            description: form.description,
            order: form.order,
            visible: form.visible?.value === 'sim',
          },
        },
      );

      if (data.data?.id && form?.icon && form?.icon !== 0) {
        await api.put(`/icons/${form?.icon}`, {
          data: { container: [data.data.id] },
        });
      }

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
            style={{ width: '250px' }}
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
                width="250px"
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
          <Label>Título</Label>
          <Input
            placeholder="Insira um título da aba"
            style={{ width: '250px' }}
            {...register('title')}
          />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Legenda</Label>
          <TextArea
            placeholder="Insira uma legenda"
            style={{ width: '845px' }}
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
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Editar"
          type="button"
          onClick={handleSubmit(onSubmit)}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default AbasForm;
