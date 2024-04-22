/* eslint-disable prettier/prettier */
import Select from '@/components/Select/Select';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { CustomerSchema, ICustomerForm } from '@/validations/CustomerSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import cpfMask from '@/utils/masks/cpfMask';
import cnpjMask from '@/utils/masks/cnpjMask';
import telephoneMask from '@/utils/masks/phone';
import zipcodeMask from '@/utils/masks/cep';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { getAddressFromCep } from '@/services/addressApi';
import api from '@/services/api';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnterprise } from '@/services/querys/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { getClients } from '@/services/querys/clients';
import UserIcon from '../../../../public/icons/peaple.svg';
import HpuseIcon from '../../../../public/icons/house.svg';
import {
  ButtonSection,
  FormSection,
  RegisterForm,
  RegisterTitle,
  Field,
  Label,
  ErrorMessage,
} from './styles';

interface CustomerProps {
  isEditing?: boolean;
  customerId?: number;
}

const CustomerForm = ({ isEditing, customerId }: CustomerProps) => {
  const { back } = useRouter();
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const enterpriseParams = {
    populate: '*',
  };

  const { data: enterprises } = useQuery({
    queryKey: ['enterprisesData', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      const enterpriseList = normalizeStrapi(data || []);
      return enterpriseList?.map(enter => ({
        label: enter.title || '',
        value: enter.id ? `${enter.id}` : '',
      }));
    },
  });

  const clientsParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id]': customerId,
    populate: '*',
  };

  const { data: client } = useQuery({
    queryKey: ['clientInfoData', clientsParams],
    queryFn: async () => {
      const clientsData = await getClients(clientsParams);
      const clients = normalizeStrapi(clientsData || []);

      reset({
        ...clients?.[0],
        email: clients?.[0]?.users?.email || undefined,
        ...(clients?.[0]?.enterprise?.id ? {
          enterprise: {
            label: clients?.[0]?.enterprise?.title || '',
            value: clients?.[0]?.enterprise?.id?.toString() || '',
          },
        } : { enterprise: undefined }),
        password: '12345678',
        confirmPassword: '12345678',
      });

      return clients?.[0];
    },
    enabled: !!customerId,
  });

  const {
    handleSubmit,
    register,
    trigger,
    setValue,
    setError,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm<ICustomerForm>({
    resolver: yupResolver(CustomerSchema),
    defaultValues: {
      ...(isEditing && {
        ...client,
        ...(client?.enterprise?.id
          ? {
            enterprise: {
              label: client?.enterprise?.title || '',
              value: client?.enterprise?.id?.toString() || '',
            },
          } : { enterprise: undefined }),
        email: client?.users?.email || undefined,
        password: '12345678',
        confirmPassword: '12345678',
      }),
    },
  });

  const onSubmit: SubmitHandler<ICustomerForm> = async form => {
    setIsLoading(true);

    try {
      const { data } = await api.post<{ data: { id: number } }>(
        '/registerUser',
        {
          ...form,
          confirmPassword: undefined,
        },
      );

      if (form?.enterprise?.value && data.data?.id) {
        await api.put(`/enterprises/${form.enterprise.value}`, {
          data: {
            client: [data.data?.id],
          },
        });
      }

      query.invalidateQueries({ queryKey: ['usersData', 'enterpriseData'] });
      handleSuccess('Cadastro realizado com sucesso.');
      back();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate: SubmitHandler<ICustomerForm> = async form => {
    setIsLoading(true);

    try {
      await api.put(`/clients/${customerId}`, {
        data: {
          ...form,
          password: undefined,
          confirmPassword: undefined,
          title: '',
        },
      });

      if (form?.enterprise?.value && customerId) {
        await api.put(`/enterprises/${form.enterprise.value}`, {
          data: {
            client: [customerId],
          },
        });
      }

      query.invalidateQueries({ queryKey: ['usersData', 'enterpriseData'] });
      handleSuccess('Cliente editado com sucesso.');
      back();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const isValid = await trigger('zipCode');
    if (!isValid) {
      return;
    }

    const cep = getValues('zipCode');

    try {
      const address = await getAddressFromCep(cep);

      if (address.erro) {
        setError('zipCode', {
          message: 'CEP inválido',
          type: 'invalid-cep',
        });

        setValue('zipCode', '');
        setValue('city', '');
        setValue('state', '');
        setValue('address', '');
        setValue('neighborhood', '');

        return;
      }

      setValue('state', address.uf);
      setValue('zipCode', address.cep);
      setValue('city', address.localidade);
      setValue('address', address.logradouro);
      setValue('neighborhood', address.bairro);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit(isEditing ? onUpdate : onSubmit)}>
      <RegisterTitle>
        <UserIcon />
        Dados pessoais
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Nome</Label>
          <Input placeholder="Insirir nome" {...register('name')} />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>E-mail</Label>
          <Input
            type="email"
            placeholder="Insirir e-mail"
            {...register('email')}
          />
          {errors?.email?.message && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>CPF</Label>
          <Input
            placeholder="Insirir cpf"
            maskFunction={cpfMask}
            maxLength={14}
            {...register('cpf')}
          />
          {errors?.cpf?.message && (
            <ErrorMessage>{errors.cpf.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>CNJP</Label>
          <Input
            placeholder="Insirir cnpj"
            maskFunction={cnpjMask}
            maxLength={18}
            {...register('cnpj')}
          />
          {errors?.cnpj?.message && (
            <ErrorMessage>{errors.cnpj.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Telefone</Label>
          <Input
            placeholder="Insirir telefone"
            maskFunction={telephoneMask}
            {...register('phone')}
          />
          {errors?.cellPhone?.message && (
            <ErrorMessage>{errors.cellPhone.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Celular</Label>
          <Input
            placeholder="Insirir celular"
            maskFunction={telephoneMask}
            {...register('cellPhone')}
          />
          {errors?.phone?.message && (
            <ErrorMessage>{errors.phone.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Empreendimento</Label>
          <Controller
            control={control}
            name="enterprise"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione empreendimento"
                onChange={onChange}
                value={value}
                options={enterprises || []}
              />
            )}
          />
        </Field>

      </FormSection>

      {!isEditing && (
        <FormSection>
          <Field>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="Insirir senha"
              {...register('password')}
            />
            {errors?.password?.message && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </Field>

          <Field>
            <Label>Confirmar senha</Label>
            <Input
              type="password"
              placeholder="Insirir senha"
              {...register('confirmPassword')}
            />
            {errors?.confirmPassword?.message && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
          </Field>
        </FormSection>
      )}

      <RegisterTitle style={{ marginTop: '2rem' }}>
        <HpuseIcon />
        Endereço
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>CEP</Label>
          <Input
            placeholder="Insirir cep"
            maskFunction={zipcodeMask}
            maxLength={9}
            {...register('zipCode', {
              onBlur: handleCepBlur,
            })}
          />
          {errors?.zipCode?.message && (
            <ErrorMessage>{errors.zipCode.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Rua</Label>
          <Input placeholder="Insirir rua" {...register('address')} />
          {errors?.address?.message && (
            <ErrorMessage>{errors.address.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Número</Label>
          <Input placeholder="Insirir número" {...register('number')} />
          {errors?.number?.message && (
            <ErrorMessage>{errors.number.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Bairro</Label>
          <Input placeholder="Insirir bairro" {...register('neighborhood')} />
          {errors?.neighborhood?.message && (
            <ErrorMessage>{errors.neighborhood.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Cidade</Label>
          <Input placeholder="Insirir cidade" {...register('city')} />
          {errors?.city?.message && (
            <ErrorMessage>{errors.city.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Estado</Label>
          <Input placeholder="Insirir estado" {...register('state')} />
          {errors?.state?.message && (
            <ErrorMessage>{errors.state.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Complemento</Label>
          <Input
            placeholder="Insirir complemento"
            {...register('complement')}
          />
          {errors?.complement?.message && (
            <ErrorMessage>{errors.complement.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Cancelar" type="button" onClick={back} />
        <Button
          text={isEditing ? 'Editar' : 'Cadastrar'}
          type="submit"
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default CustomerForm;
