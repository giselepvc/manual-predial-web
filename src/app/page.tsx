'use client';

import { useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import {
  ForgotSchema,
  IForgotForm,
  ILoginForm,
  LoginSchema,
} from '@/validations/LoginSchema';
import { ILoginResponse, useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { localStorageKeys } from '@/utils/localStorageKeys';
import {
  ErrorMessage,
  FormContainer,
  FullPage,
  InputSection,
  LoginInput,
  LoginLabel,
  LoginTitle,
  LogoContainer,
  LogoImg,
  RegisterText,
} from './styles';

const Login = () => {
  const router = useRouter();
  const { setUserId, setRole } = useAuth();

  const [show, setShow] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'login' | 'forgot'>('login');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<ILoginForm> = async form => {
    try {
      setIsSubmitting(true);

      const { data } = await api.post<ILoginResponse>('/auth/local', {
        identifier: form.email.trim(),
        password: form.password.trim(),
        rememberMe: true,
      });

      setUserId(data.user?.id);
      setRole(data.role);

      localStorage.setItem(localStorageKeys.accessToken, data.jwt);
      localStorage.setItem(localStorageKeys.user, JSON.stringify(data.user));
      localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken);
      localStorage.setItem(localStorageKeys.role, data.role.toString());

      if (data.role === 3) router.push('/company');
      if (data.role === 1) router.push('/users');
      if (data.role === 4) router.push('/panel');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: errorsForgot },
  } = useForm<IForgotForm>({
    resolver: yupResolver(ForgotSchema),
  });

  const onForgot: SubmitHandler<IForgotForm> = async form => {
    try {
      setIsSubmitting(true);

      await api.post<ILoginResponse>('/auth/forgot-password', {
        email: form.email.trim(),
      });

      handleSuccess('Nova senha enviada por e-mail.');
      setStep('login');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FullPage>
      <LogoContainer>
        <LogoImg src="/img/logo.svg" alt="Logomarca Manual Predial" />
      </LogoContainer>

      {step === 'login' && (
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <LoginTitle>Login</LoginTitle>

          <InputSection>
            <LoginLabel>E-mail</LoginLabel>
            <LoginInput
              placeholder="Insira seu e-mail"
              {...register('email')}
            />
            {errors?.email?.message && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </InputSection>

          <InputSection>
            <LoginLabel>Senha</LoginLabel>
            <LoginInput
              placeholder="Insira sua senha"
              type={show ? 'text' : 'password'}
              {...register('password')}
            />
            {show ? (
              <VscEye
                className="icon"
                size={22}
                onClick={() => setShow(false)}
              />
            ) : (
              <VscEyeClosed
                className="icon"
                size={22}
                onClick={() => setShow(true)}
              />
            )}
            {errors?.password?.message && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputSection>

          <RegisterText
            style={{ margin: '-0.6rem 0 1rem 0' }}
            onClick={() => setStep('forgot')}
          >
            Esqueci minha senha
          </RegisterText>

          <Button
            type="submit"
            text="Fazer Login"
            disabled={isSubmitting}
            style={{ width: '170px', marginBottom: '2rem' }}
          />

          <RegisterText>
            Ainda não possui uma conta? <span>Cadastre-se já</span>
          </RegisterText>
        </FormContainer>
      )}

      {step === 'forgot' && (
        <FormContainer onSubmit={handleSubmitForgot(onForgot)}>
          <LoginTitle style={{ textAlign: 'center', width: '500px' }}>
            Recuperar senha
          </LoginTitle>

          <InputSection>
            <LoginLabel>E-mail</LoginLabel>
            <LoginInput
              placeholder="Insira seu e-mail"
              {...registerForgot('email')}
            />
            {errorsForgot?.email?.message && (
              <ErrorMessage>{errorsForgot.email.message}</ErrorMessage>
            )}
          </InputSection>

          <Button
            type="submit"
            text="Recuperar"
            disabled={isSubmitting}
            style={{ width: '170px', marginTop: '2rem' }}
          />

          <RegisterText
            style={{
              marginTop: '-1rem',
              textDecoration: 'underline',
            }}
            onClick={() => setStep('login')}
          >
            Voltar
          </RegisterText>
        </FormContainer>
      )}
    </FullPage>
  );
};

export default Login;
