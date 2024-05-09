import Input from '@/components/Input/Input';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { urlBuild } from '@/utils/urlBuild';
import { useQueryClient } from '@tanstack/react-query';
import UserIcon from '../../../../public/icons/peaple.svg';
import {
  Field,
  FormSection,
  Label,
  Photo,
  PhotoChangeButton,
  PhotoContentWrapper,
  PhotoSection,
  PhotoTitle,
  RegisterForm,
  RegisterTitle,
} from './styles';

const SettingsForm = () => {
  const { user, setUserId, role } = useAuth();
  const query = useQueryClient();
  const [image, setImage] = useState<File>();

  const { register } = useForm({
    defaultValues: {
      email: user?.users?.email || '',
      name: user?.name || '',
    },
  });

  const renderImage = () => {
    if (role === 1) {
      return user?.enterprise?.company?.image?.url
        ? urlBuild(user?.enterprise?.company?.image?.url)
        : '/icons/image.svg';
    }

    return user?.users?.image?.url
      ? urlBuild(user?.users?.image?.url)
      : '/icons/image.svg';
  };

  const photoHandler = () => {
    if (image) return URL.createObjectURL(image);
    return '/icons/image.svg';
  };

  const onSubmit = async (file: File) => {
    if (role === 1) {
      if (file && user?.enterprise?.company?.id) {
        try {
          const formData = new FormData();

          formData.append('ref', 'api::company.company');
          formData.append('refId', `${user?.enterprise?.company?.id}`);
          formData.append('field', 'image');
          formData.append('files', file);

          await api.post('/upload', formData);

          query.invalidateQueries({ queryKey: ['userData'] });
          setUserId(user?.users?.id);
          handleSuccess('Imagem de perfil alterada.');
        } catch (error) {
          handleError(error);
        }
      }
    }

    if (file && user?.users?.id) {
      try {
        const formData = new FormData();

        formData.append('ref', 'plugin::users-permissions.user');
        formData.append('refId', `${user?.users?.id}`);
        formData.append('field', 'image');
        formData.append('files', file);

        await api.post('/upload', formData);

        query.invalidateQueries({ queryKey: ['userData'] });
        setUserId(user?.users?.id);
        handleSuccess('Imagem de perfil alterada.');
      } catch (error) {
        handleError(error);
      }
    }
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
    </RegisterForm>
  );
};

export default SettingsForm;
