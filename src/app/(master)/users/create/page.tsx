'use client';

import Button from '@/components/Button/Button';
import PageLayout from '@/components/PageLayout/PageLayout';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import { useForm } from 'react-hook-form';
import Select from '@/components/Select/Select';
import UserIcon from '../../../../../public/icons/peaple.svg';
import HpuseIcon from '../../../../../public/icons/house.svg';
import {
  ButtonSection,
  FormSection,
  RegisterForm,
  RegisterTitle,
  Field,
  Label,
} from './styles';

const UserRegisterPage = () => {
  const { back } = useRouter();

  const { handleSubmit } = useForm();

  const onSubmit = () => {
    console.log('teste');
  };

  return (
    <PageLayout title="Cadastro de usuário">
      <RegisterForm onSubmit={handleSubmit(onSubmit)}>
        <RegisterTitle>
          <UserIcon />
          Dados pessoais
        </RegisterTitle>

        <FormSection>
          <Field>
            <Label>Nome</Label>
            <Input placeholder="Insirir nome" />
          </Field>

          <Field>
            <Label>E-mail</Label>
            <Input placeholder="Insirir e-mail" />
          </Field>

          <Field>
            <Label>CPF</Label>
            <Input placeholder="Insirir cpf" />
          </Field>

          <Field>
            <Label>CNJP</Label>
            <Input placeholder="Insirir cnpj" />
          </Field>
        </FormSection>

        <FormSection>
          <Field>
            <Label>Telefone</Label>
            <Input placeholder="Insirir telefone" />
          </Field>

          <Field>
            <Label>Celular</Label>
            <Input placeholder="Insirir celular" />
          </Field>

          <Field>
            <Label>Empreendimento</Label>
            <Select placeholder="Selecione empreendimento" options={[]} />
          </Field>
        </FormSection>

        <FormSection>
          <Field>
            <Label>Senha</Label>
            <Input placeholder="Insirir senha" />
          </Field>

          <Field>
            <Label>Confirmar senha</Label>
            <Input placeholder="Insirir senha" />
          </Field>
        </FormSection>

        <RegisterTitle style={{ marginTop: '2rem' }}>
          <HpuseIcon />
          Endereço
        </RegisterTitle>

        <FormSection>
          <Field>
            <Label>CEP</Label>
            <Input placeholder="Insirir cep" />
          </Field>

          <Field>
            <Label>Rua</Label>
            <Input placeholder="Insirir rua" />
          </Field>

          <Field>
            <Label>Número</Label>
            <Input placeholder="Insirir número" />
          </Field>

          <Field>
            <Label>Bairro</Label>
            <Input placeholder="Insirir bairro" />
          </Field>
        </FormSection>

        <FormSection>
          <Field>
            <Label>Cidade</Label>
            <Input placeholder="Insirir cidade" />
          </Field>

          <Field>
            <Label>Estado</Label>
            <Input placeholder="Insirir estado" />
          </Field>

          <Field>
            <Label>Ponto de referência</Label>
            <Input placeholder="Insirir ponto de referência" />
          </Field>
        </FormSection>

        <FormSection>
          <Field>
            <Label>Complemento</Label>
            <Input placeholder="Insirir complemento" />
          </Field>
        </FormSection>

        <ButtonSection>
          <Button outlined text="Cancelar" type="button" onClick={back} />
          <Button text="Cadastrar" type="submit" />
        </ButtonSection>
      </RegisterForm>
    </PageLayout>
  );
};

export default UserRegisterPage;
