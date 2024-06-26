import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaLock } from 'react-icons/fa6';

import { ChangePasswordSchema } from '@/validations/LoginSchema';
import { IChangePasswordForm } from '@/validations/LoginSchema';

import handleError, { handleSuccess } from '@/utils/handleToast';
import { urlBuild } from '@/utils/urlBuild';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';

import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

import UserIcon from '../../../../public/icons/peaple.svg';

import {
  Field,
  FormSection,
  Label,
  Photo,
  PasswordForm,
  PhotoChangeButton,
  PhotoContentWrapper,
  PhotoSection,
  PhotoTitle,
  RegisterForm,
  RegisterTitle,
  ErrorMessage,
} from './styles';

const SettingsForm = () => {
  const { user, setUserId, role } = useAuth();
  const query = useQueryClient();

  const [image, setImage] = useState<File>();

  const isCompany = role === 1;

  const { register } = useForm({
    defaultValues: {
      email: user?.users?.email || '',
      name: user?.name || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IChangePasswordForm>({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const handleConcluded = () => {
    query.invalidateQueries({ queryKey: ['userData'] });
    setUserId(user?.users?.id);
    handleSuccess('Imagem de perfil alterada.');
  };

  const onSubmit = async (file: File) => {
    if (file) {
      try {
        const ref = isCompany
          ? 'api::company.company'
          : 'plugin::users-permissions.user';
        const refId =
          role === 1 ? user?.enterprise?.company?.id : user?.users?.id;

        const formData = new FormData();

        formData.append('field', 'image');
        formData.append('files', file);
        formData.append('ref', ref);
        formData.append('refId', refId?.toString() || '');

        await api.post('/upload', formData);

        handleConcluded();
      } catch (error) {
        handleError(error);
      }
    }
  };

  const onUpdate: SubmitHandler<IChangePasswordForm> = async form => {
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.oldPassword,
        password: form.password,
        passwordConfirmation: form.confirmPassword,
      });

      handleSuccess('Senha alterada com sucesso.');
      reset();
    } catch (error) {
      handleError(error);
    }
  };

  const handlemage = (image: string) => {
    if (image) return urlBuild(image);
    return '/icons/image.svg';
  };

  const renderImage = () => {
    if (role === 1) handlemage(user?.enterprise?.company?.image?.url || '');
    return handlemage(user?.users?.image?.url || '');
  };

  const photoHandler = () => {
    if (image) return URL.createObjectURL(image);
    return '/icons/image.svg';
  };

  return (
    <RegisterForm>
      <RegisterTitle>
        <UserIcon />
        Dados pessoais
      </RegisterTitle>

      <FormSection>
        <PhotoSection data-com="PhotoSection">
          <PhotoChangeButton data-com="PhotoChangeButton">
            <Photo src={image ? photoHandler() : renderImage()} alt="profile" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={e => {
                if (e.target?.files?.[0]) {
                  setImage(e.target.files[0]);
                  onSubmit(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <PhotoContentWrapper data-com="PhotoContentWrapper">
              <PhotoTitle data-com="PhotoTitle">
                Alterar foto de perfil
              </PhotoTitle>
            </PhotoContentWrapper>
          </PhotoChangeButton>
        </PhotoSection>

        <RegisterForm>
          <Field>
            <Label>Nome</Label>
            <Input
              placeholder="Insirir nome"
              style={{ width: '400px' }}
              {...register('name')}
              disabled
            />
          </Field>

          <Field>
            <Label>E-mail</Label>
            <Input
              type="email"
              style={{ width: '400px' }}
              placeholder="Insirir e-mail"
              {...register('email')}
              disabled
            />
          </Field>
        </RegisterForm>
      </FormSection>

      <RegisterTitle>
        <FaLock />
        Alterar senha
      </RegisterTitle>

      <PasswordForm onSubmit={handleSubmit(onUpdate)}>
        <Field>
          <Label>Senha antiga</Label>
          <Input
            type="password"
            placeholder="Insira sua senha antiga"
            style={{ width: '400px' }}
            {...registerPassword('oldPassword')}
          />
          {errors?.oldPassword?.message && (
            <ErrorMessage>{errors.oldPassword.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Nova senha</Label>
          <Input
            type="password"
            style={{ width: '400px' }}
            placeholder="Insira sua nova senha"
            {...registerPassword('password')}
          />
          {errors?.password?.message && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Confirme a nova senha</Label>
          <Input
            type="password"
            style={{ width: '400px' }}
            placeholder="Insira a confirmação de senha"
            {...registerPassword('confirmPassword')}
          />
          {errors?.confirmPassword?.message && (
            <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
          )}
        </Field>

        <Button
          text="Alterar senha"
          type="submit"
          style={{ marginTop: '1rem' }}
        />
      </PasswordForm>
    </RegisterForm>
  );
};

export default SettingsForm;
