import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import IconsSchema from '@/validations/IconsSchema';
import {
  ButtonSection,
  FormSection,
  RegisterForm,
  Field,
  Label,
  ErrorMessage,
  UploadLogoLabel,
} from './styles';

type FormValues = {
  name: string;
};

const IconsForm = () => {
  const { back } = useRouter();
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File>();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(IconsSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async form => {
    setIsLoading(true);

    if (!image) {
      handleError('Selecione uma imagem');
      return;
    }

    try {
      const { data } = await api.post<{ data: { id: number } }>('/icons', {
        data: {
          title: form.name,
          active: false,
        },
      });

      if (data.data?.id && image) {
        const formData = new FormData();

        formData.append('ref', 'api::icon.icon');
        formData.append('refId', data.data?.id?.toString() || '');
        formData.append('field', 'image');
        formData.append('files', image);

        await api.post('/upload', formData);
      }

      handleSuccess('Cadastro realizado com sucesso.');
      query.invalidateQueries({ queryKey: ['iconsData'] });
      back();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit(onSubmit)}>
      <FormSection>
        <Field>
          <Label>Nome do ícone</Label>
          <Input
            placeholder="Insirir nome"
            style={{ width: '250px' }}
            {...register('name')}
          />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Selecione um ícone</Label>
          <UploadLogoLabel>
            {image ? image.name : 'Selecionar arquivo'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => {
                if (e.target?.files?.[0]) {
                  setImage(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
          </UploadLogoLabel>
        </Field>
      </FormSection>

      <ButtonSection style={{ marginTop: '3rem' }}>
        <Button outlined text="Cancelar" type="button" onClick={back} />
        <Button text="Cadastrar" type="submit" disabled={isLoading} />
      </ButtonSection>
    </RegisterForm>
  );
};

export default IconsForm;
