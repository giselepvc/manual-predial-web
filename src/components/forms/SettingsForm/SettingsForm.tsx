import Input from '@/components/Input/Input';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
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
  PhotoWrapper,
  RegisterForm,
  RegisterTitle,
} from './styles';

const SettingsForm = () => {
  const { user } = useAuth();

  const [imageError, setImageError] = useState(false);

  const { register, control, watch } = useForm({
    defaultValues: {
      email: user?.email || '',
      name: user?.username || '',
      photo: undefined,
    },
  });

  const onErrorImage = () => setImageError(true);

  const renderImage = () => {
    return '/icons/image.svg';
  };

  const photoHandler = () => {
    if (watch('photo')) {
      return URL.createObjectURL(watch('photo') as any);
    }

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
          <PhotoWrapper data-com="PhotoWrapper">
            <Photo
              data-com="Photo"
              src={watch('photo') ? photoHandler() : renderImage()}
              alt="profile"
              width={100}
              height={100}
              onError={onErrorImage}
            />
            <PhotoChangeButton data-com="PhotoChangeButton">
              <Controller
                control={control}
                name="photo"
                render={({ field: { onChange } }) => (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => onChange(e.target.files[0])}
                  />
                )}
              />
            </PhotoChangeButton>
          </PhotoWrapper>
          <PhotoContentWrapper data-com="PhotoContentWrapper">
            <PhotoTitle data-com="PhotoTitle">
              Alterar foto de perfil
            </PhotoTitle>
          </PhotoContentWrapper>
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
