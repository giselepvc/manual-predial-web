import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Modal from '@/components/Modal/Modal';
import Input from '@/components/Input/Input';

import { IUserPasswordForm } from '@/validations/LoginSchema';
import { UserPasswordSchema } from '@/validations/LoginSchema';

import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';

import {
  Button,
  ButtonsContainer,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  ModalContainer,
  ModalHeader,
} from './styles';

interface Props {
  customerId: number;
  onClose: () => void;
}

const PasswordModal = ({ onClose, customerId }: Props) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserPasswordForm>({
    resolver: yupResolver(UserPasswordSchema),
  });

  const onSubmit: SubmitHandler<IUserPasswordForm> = async data => {
    try {
      setLoading(true);

      await api.put(
        `/updatePassword?updaterId=${user?.users?.id}&userId=${customerId}`,
        {
          password: data?.password,
        },
      );

      handleSuccess('Senha alterada com sucesso.');
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal>
      <ModalContainer>
        <ModalHeader>Alterar senha</ModalHeader>

        <FormSection onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <Label>Nova senha</Label>
            <Input
              style={{ width: '100%' }}
              placeholder="Insirir a nova senha"
              {...register('password')}
            />
            {errors?.password?.message && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>Confirme a nova senha</Label>
            <Input
              style={{ width: '100%' }}
              placeholder="Insirir a confirmação de senha"
              {...register('confirmPassword')}
            />
            {errors?.confirmPassword?.message && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
          </Field>

          <ButtonsContainer>
            <Button $variant="outlined" onClick={onClose}>
              Cancelar
            </Button>

            <Button $variant="primary" disabled={loading} type="submit">
              Alterar
            </Button>
          </ButtonsContainer>
        </FormSection>
      </ModalContainer>
    </Modal>
  );
};

export default PasswordModal;
