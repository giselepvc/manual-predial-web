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
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnterprise } from '@/services/querys/enterprise';
import { RecursiveNormalize as R } from '@/utils/normalizeStrapi';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { getClients } from '@/services/querys/clients';
import { useAuth } from '@/hooks/useAuth';
import { getGroups } from '@/services/querys/groups';
import { IEnterprises } from '@/interfaces/enterprise';
import { getCompanies } from '@/services/querys/company';
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
  isCompany?: boolean;
}

const CustomerForm = ({
  isEditing,
  customerId,
  isCompany = false,
}: CustomerProps) => {
  const { back } = useRouter();
  const { user, role } = useAuth();
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [enterpriseList, setEnterprise] = useState<R<IEnterprises[]>>([]);

  const option = {
    label: user?.enterprise?.title || '',
    value: user?.enterprise?.id?.toString() || '',
  };

  const {
    handleSubmit,
    register,
    trigger,
    setValue,
    setError,
    getValues,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<ICustomerForm>({
    resolver: yupResolver(CustomerSchema),
  });

  const companiesParams = {
    populate: '*',
  };

  const { data: companies } = useQuery({
    queryKey: ['companiesOptions', companiesParams],
    queryFn: async () => {
      const data = await getCompanies(companiesParams);
      const companiesList = normalizeStrapi(data || []);
      return companiesList?.map(enter => ({
        label: enter.name || '',
        value: enter.id?.toString() || '',
      }));
    },
  });

  const enterpriseParams = {
    populate: '*',
    'filters[company][id]': watch('company.value'),
  };

  const { data: enterprises } = useQuery({
    queryKey: ['enterprisesData', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      const enterpriseList = normalizeStrapi(data || []);
      setEnterprise(enterpriseList);
      return enterpriseList?.map(enter => ({
        label: enter.title || '',
        value: enter.id ? `${enter.id}` : '',
      }));
    },
    enabled: !!watch('company'),
  });

  const clientsParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id]': customerId,
    populate: ['users', 'group.enterprise', 'enterprise'],
  };

  useQuery({
    queryKey: ['clientInfoData', clientsParams],
    queryFn: async () => {
      const clientsData = await getClients(clientsParams);
      const clients = normalizeStrapi(clientsData || []);

      reset({
        ...clients?.[0],
        login: clients?.[0]?.users?.username || undefined,
        email: clients?.[0]?.users?.email || undefined,
        ...(clients?.[0]?.enterprise && {
          enterprise: {
            label: isCompany
              ? clients?.[0]?.group?.enterprise?.title || ''
              : clients?.[0]?.enterprise?.title,
            value: isCompany
              ? clients?.[0]?.group?.enterprise?.id?.toString() || ''
              : clients?.[0]?.enterprise?.id?.toString(),
          },
        }),
        ...(clients?.[0]?.group && {
          group: {
            label: clients?.[0]?.group?.name || '',
            value: clients?.[0]?.group?.id?.toString() || '',
          },
        }),
        password: '12345678',
        confirmPassword: '12345678',
      });

      return clients?.[0];
    },
    enabled: !!customerId,
  });

  const groupsParams = {
    'sort[createdAt]': 'DESC',
    populate: '*',
    'filters[enterprise][id]': watch('enterprise.value') || option?.value,
  };

  const { data: groupsOptions } = useQuery({
    queryKey: ['groupList', groupsParams],
    queryFn: async () => {
      const data = await getGroups(groupsParams);
      const groups = normalizeStrapi(data || []);
      return groups?.map(item => ({
        label: item?.name || '',
        value: item?.id.toString() || '',
      }));
    },
    enabled: !!watch('enterprise') && !!isCompany,
  });

  const onSubmit: SubmitHandler<ICustomerForm> = async form => {
    try {
      setIsLoading(true);
      if (isCompany) {
        await api.post<{ data: { id: number } }>('/registerViewer', {
          ...form,
          username: form.login,
          confirmPassword: undefined,
          group: Number(form?.group?.value),
          enterprise: undefined,
          company: undefined,
        });
      } else {
        const { data } = await api.post<{ data: { id: number } }>(
          '/registerUser',
          {
            ...form,
            username: form.login,
            enterprise: Number(form?.enterprise?.value),
            group: undefined,
            confirmPassword: undefined,
            company: undefined,
          },
        );

        if (form?.enterprise?.value && data.data?.id && !isCompany) {
          await api.put(`/enterprises/${form.enterprise.value}`, {
            data: { client: [data.data?.id] },
          });
        }
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
    try {
      setIsLoading(true);
      await api.put(`/clients/${customerId}`, {
        data: {
          ...form,
          enterprise: isCompany
            ? undefined
            : Number(form?.enterprise?.value || user?.enterprise?.id),
          group: form?.group?.value ? Number(form?.group?.value) : undefined,
          password: undefined,
          confirmPassword: undefined,
          company: undefined,
          title: '',
        },
      });

      if (form?.enterprise?.value && customerId && !isCompany) {
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
    if (!isValid) return;
    const cep = getValues('zipCode');

    if (cep) {
      try {
        const address = await getAddressFromCep(cep);

        if (address.erro) {
          setError('zipCode', { message: 'CEP inválido', type: 'invalid-cep' });
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
    }
  };

  useEffect(() => {
    if (watch('enterprise.value') && !isEditing) {
      const enterpriseFind = enterpriseList.find(
        etp => etp.id.toString() === watch('enterprise.value'),
      );

      setValue('state', enterpriseFind?.state);
      setValue('zipCode', enterpriseFind?.zipCode);
      setValue('city', enterpriseFind?.city);
      setValue('address', enterpriseFind?.address);
      setValue('neighborhood', enterpriseFind?.neighborhood);
      setValue('number', enterpriseFind?.number);
    }

    if (role === 1) {
      setValue('state', user?.enterprise?.state);
      setValue('zipCode', user?.enterprise?.zipCode);
      setValue('city', user?.enterprise?.city);
      setValue('address', user?.enterprise?.address);
      setValue('neighborhood', user?.enterprise?.neighborhood);
      setValue('number', user?.enterprise?.number);
    }
  }, [watch('enterprise'), role]);

  console.log(errors);

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
          <Label>Login</Label>
          <Input placeholder="Insirir login" {...register('login')} />
          {errors?.login?.message && (
            <ErrorMessage>{errors.login.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>E-mail</Label>
          <Input
            type="text"
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
      </FormSection>

      <FormSection>
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

        <Field>
          <Label>Telefone</Label>
          <Input
            placeholder="Insirir telefone"
            maskFunction={telephoneMask}
            {...register('phone')}
          />
          {errors?.phone?.message && (
            <ErrorMessage>{errors.phone.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Celular</Label>
          <Input
            placeholder="Insirir celular"
            maskFunction={telephoneMask}
            {...register('cellPhone')}
          />
          {errors?.cellPhone?.message && (
            <ErrorMessage>{errors.cellPhone.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Construtora</Label>
          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione construtora"
                onChange={onChange}
                value={role === 1 ? option : value}
                options={companies || []}
                isDisabled={role === 1}
              />
            )}
          />
          {errors?.company?.value?.message && (
            <ErrorMessage>{errors.company.value.message}</ErrorMessage>
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
                value={role === 1 ? option : value}
                options={enterprises || []}
                isDisabled={role === 1}
              />
            )}
          />
          {errors?.enterprise?.value?.message && (
            <ErrorMessage>{errors.enterprise.value.message}</ErrorMessage>
          )}
        </Field>

        {isCompany && (
          <Field>
            <Label>Grupo</Label>
            <Controller
              control={control}
              name="group"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Selecione um grupo"
                  onChange={onChange}
                  value={value}
                  options={groupsOptions || []}
                />
              )}
            />
          </Field>
        )}
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
          <Label>Complemento / N° unidade</Label>
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
