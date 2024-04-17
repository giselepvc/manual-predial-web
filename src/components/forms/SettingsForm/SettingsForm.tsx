import Input from '@/components/Input/Input';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import api from '@/services/api';
import handleError from '@/utils/handleToast';
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
  const { user } = useAuth();

  const [imageError, setImageError] = useState(false);
  const [image, setImage] = useState<File>();

  const { register } = useForm({
    defaultValues: {
      email: user?.email || '',
      name: user?.username || '',
    },
  });

  const onErrorImage = () => setImageError(true);

  const renderImage = () => {
    return '/icons/image.svg';
  };

  const photoHandler = () => {
    if (image && !imageError) {
      return URL.createObjectURL(image);
    }

    return '/icons/image.svg';
  };

  const onSubmit = async (file: File) => {
    try {
      const formData = new FormData();

      formData.append('ref', 'plugin::users-permissions.user');
      formData.append('refId', `${user?.id}`);
      formData.append('field', 'image');
      if (file) {
        formData.append('files', file);
      }

      await api.post('/upload', formData);
    } catch (error) {
      handleError(error);
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
            <Photo
              data-com="Photo"
              src={image ? photoHandler() : renderImage()}
              alt="profile"
              width={100}
              height={100}
              onError={onErrorImage}
            />
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
