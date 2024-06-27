import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

import { CustomerSchema, ICustomerForm } from '@/validations/CustomerSchema';

import cpfMask from '@/utils/masks/cpfMask';
import cnpjMask from '@/utils/masks/cnpjMask';
import telephoneMask from '@/utils/masks/phone';
import zipcodeMask from '@/utils/masks/cep';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { getAddressFromCep } from '@/services/addressApi';
import { useEnterprise } from '@/services/querys/enterprise';
import { useEnterpriseOptions } from '@/services/querys/enterprise';
import { getClients } from '@/services/querys/clients';
import { useGroupsOptions } from '@/services/querys/groups';
import { useCompaniesOptions } from '@/services/querys/company';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

import HpuseIcon from '../../../../public/icons/house.svg';
import UserIcon from '../../../../public/icons/peaple.svg';

import {
  ButtonSection,
  FormSection,
  RegisterForm,
  RegisterTitle,
  Field,
  Label,
  LabelPassword,
  ErrorMessage,
} from './styles';
import PasswordModal from './components/PasswordModal/PasswordModal';

interface Response {
  data: { id: number };
}

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
  const [passwordModal, setPasswordModal] = useState(false);

  const option = {
    label: user?.enterprise?.title || '',
    value: user?.enterprise?.id?.toString() || '',
  };

  const optionCompany = {
    label: user?.enterprise?.company?.name || '',
    value: user?.enterprise?.company?.id?.toString() || '',
  };

  const {
    handleSubmit,
    register,
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

  const { data: companies } = useCompaniesOptions({ populate: '*' });

  const enterpriseParams = {
    populate: '*',
    'filters[company][id]': watch('company.value'),
    ...(!isCompany && { 'filters[client][id][$null]': true }),
  };

  const { data: enterpriseList } = useEnterprise(
    enterpriseParams,
    !!watch('company'),
  );

  const { data: enterprises } = useEnterpriseOptions(
    enterpriseParams,
    !!watch('company'),
  );

  const groupsParams = {
    'sort[createdAt]': 'DESC',
    'filters[enterprise][id]': watch('enterprise.value') || option?.value,
    populate: '*',
  };

  const { data: groupsOptions } = useGroupsOptions(
    groupsParams,
    !!watch('enterprise') && !!isCompany,
  );

  const clientsParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id]': customerId,
    'populate[0]': 'users',
    'populate[1]': 'users.image',
    'populate[2]': 'group.enterprise.company',
    'populate[3]': 'enterprise.company',
  };

  useQuery({
    queryKey: ['clientInfoData', clientsParams],
    queryFn: async () => {
      const clientsData = await getClients(clientsParams);
      const clients = normalizeStrapi(clientsData || []);
      const client = clients?.[0];

      reset({
        ...client,
        login: client?.users?.username || undefined,
        email: client?.users?.email || undefined,
        password: '12345678',
        confirmPassword: '12345678',
        ...(client?.enterprise && {
          enterprise: {
            label: isCompany
              ? client?.group?.enterprise?.title
              : client?.enterprise?.title,
            value: isCompany
              ? client?.group?.enterprise?.id?.toString()
              : client?.enterprise?.id?.toString(),
          },
        }),
        ...(client?.group && {
          group: {
            label: client?.group?.name || '',
            value: client?.group?.id?.toString() || '',
          },
        }),
        company: {
          label: isCompany
            ? client?.group?.enterprise?.company?.name
            : client?.enterprise?.company?.name,
          value: isCompany
            ? client?.group?.enterprise?.company?.id?.toString()
            : client?.enterprise?.company?.id?.toString(),
        },
      });

      return client;
    },
    enabled: !!customerId,
  });

  const handleCompletionRequest = () => {
    query.invalidateQueries({ queryKey: ['usersData', 'enterpriseData'] });
    back();
  };

  const onSubmit: SubmitHandler<ICustomerForm> = async form => {
    try {
      setIsLoading(true);

      const userObj = {
        ...form,
        username: form.login,
        email: form?.email || null,
        creativeEnterprise: form?.enterprise?.label,
        creativeCompany: form?.company?.label,
        confirmPassword: undefined,
        company: undefined,
        ...(isCompany
          ? { group: Number(form?.group?.value) }
          : { enterprise: Number(form?.enterprise?.value) }),
        ...(isCompany ? { enterprise: undefined } : { group: undefined }),
      };

      if (isCompany) await api.post('/registerViewer', userObj);

      if (!isCompany) {
        const { data } = await api.post<Response>('/registerUser', userObj);

        if (form?.enterprise?.value && data.data?.id && !isCompany) {
          await api.put(`/enterprises/${form.enterprise.value}`, {
            data: { client: [data.data?.id] },
          });
        }
      }

      handleSuccess('Cadastro realizado com sucesso.');
      handleCompletionRequest();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate: SubmitHandler<ICustomerForm> = async form => {
    try {
      setIsLoading(true);

      const enterId = Number(form?.enterprise?.value || user?.enterprise?.id);
      const userObj = {
        ...form,
        username: form.login,
        email: form?.email || null,
        enterprise: !isCompany ? enterId : undefined,
        group: form?.group?.value ? Number(form?.group?.value) : undefined,
        creativeEnterprise: form?.enterprise?.label,
        creativeCompany: form?.company?.label,
        password: undefined,
        confirmPassword: undefined,
        company: undefined,
        title: '',
      };

      await api.put(`/clients/${customerId}`, { data: userObj });

      if (form?.enterprise?.value && customerId && !isCompany) {
        await api.put(`/enterprises/${form.enterprise.value}`, {
          data: { client: [customerId] },
        });
      }

      handleSuccess('Cliente editado com sucesso.');
      handleCompletionRequest();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const setAddressValues = (address: any) => {
      setValue('state', address.uf || '');
      setValue('zipCode', address.cep || '');
      setValue('city', address.localidade || '');
      setValue('address', address.logradouro || '');
      setValue('neighborhood', address.bairro || '');
    };

    const cep = getValues('zipCode');
    if (!cep) return;

    try {
      const address = await getAddressFromCep(cep);

      if (address.erro) {
        setError('zipCode', { message: 'CEP inválido', type: 'invalid-cep' });
        setAddressValues({});
        return;
      }

      setAddressValues(address);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const setEnterpriseValues = (enterprise: any) => {
      setValue('state', enterprise?.state);
      setValue('zipCode', enterprise?.zipCode);
      setValue('city', enterprise?.city);
      setValue('address', enterprise?.address);
      setValue('neighborhood', enterprise?.neighborhood);
      setValue('number', enterprise?.number);
      setValue('complement', enterprise?.complement);
    };

    const enterpriseValue = watch('enterprise.value');

    if (enterpriseValue && !isEditing) {
      const enterpriseFind = enterpriseList?.find(
        etp => etp.id.toString() === enterpriseValue,
      );
      setEnterpriseValues(enterpriseFind);
    }

    if (role === 1) {
      setEnterpriseValues(user?.enterprise);
      setValue('company', optionCompany);
      setValue('enterprise', option);
    }
  }, [watch('enterprise'), role]);

  return (
    <>
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
                  value={role === 1 ? optionCompany : value}
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

        <LabelPassword onClick={() => setPasswordModal(true)}>
          altera senha desse usuário
        </LabelPassword>

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

      {passwordModal && customerId && (
        <PasswordModal
          customerId={customerId}
          onClose={() => setPasswordModal(false)}
        />
      )}
    </>
  );
};

export default CustomerForm;
