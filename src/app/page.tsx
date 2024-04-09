'use client';

import { useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import { ILoginForm, LoginSchema } from '@/validations/LoginSchema';
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

  const [show, setShow] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<ILoginForm> = form => {
    router.push('/users');
  };

  return (
    <FullPage>
      <LogoContainer>
        <LogoImg src="/img/logo.svg" alt="Logomarca Manual Predial" />
      </LogoContainer>

      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <LoginTitle>Login</LoginTitle>

        <InputSection>
          <LoginLabel>E-mail</LoginLabel>
          <LoginInput placeholder="Insira seu e-mail" {...register('email')} />
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
            <VscEye className="icon" size={22} onClick={() => setShow(false)} />
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

        <RegisterText style={{ margin: '-0.6rem 0 1rem 0' }}>
          Esqueci minha senha
        </RegisterText>

        <Button
          type="submit"
          text="Fazer Login"
          style={{ width: '170px', marginBottom: '2rem' }}
        />

        <RegisterText>
          Ainda não possui uma conta? <span>Cadastre-se já</span>
        </RegisterText>
      </FormContainer>
    </FullPage>
  );
};

export default Login;
