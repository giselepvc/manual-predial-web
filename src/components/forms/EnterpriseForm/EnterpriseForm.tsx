import Select from '@/components/Select/Select';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  EnterpriseSchema,
  IEnterpriseForm,
} from '@/validations/EnterpriseSchema';
import cnpjMask from '@/utils/masks/cnpjMask';
import telephoneMask from '@/utils/masks/phone';
import zipcodeMask from '@/utils/masks/cep';
import { getAddressFromCep } from '@/services/addressApi';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useState } from 'react';
import api from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/services/querys/company';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { getEnterprise } from '@/services/querys/enterprise';
import {
  ButtonSection,
  FormSection,
  RegisterForm,
  RegisterTitle,
  Field,
  Label,
  ErrorMessage,
} from './styles';
import HpuseIcon from '../../../../public/icons/house.svg';
import UserIcon from '../../../../public/icons/peaple.svg';

interface CompanProps {
  isEditing?: boolean;
  companyId?: string;
}

const EnterpriseForm = ({ isEditing, companyId }: CompanProps) => {
  const { back } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const companiesParams = {
    populate: '*',
  };

  const { data: companies } = useQuery({
    queryKey: ['CompaniesData', companiesParams],
    queryFn: async () => {
      const data = await getCompanies(companiesParams);
      return normalizeStrapi(data || []);
    },
  });

  const enterpriseParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id]': companyId,
    populate: 'company',
  };

  useQuery({
    queryKey: ['enterpriseData', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      const enterprises = normalizeStrapi(data || []);

      reset({
        ...enterprises?.[0],
        company: {
          label: enterprises?.[0]?.company?.name || '',
          value: `${enterprises?.[0]?.company?.id || ''}`,
        },
      });

      return enterprises?.[0];
    },
    enabled: !!companyId,
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
  } = useForm<IEnterpriseForm>({
    resolver: yupResolver(EnterpriseSchema),
  });

  const onSubmit: SubmitHandler<IEnterpriseForm> = async form => {
    try {
      setIsLoading(true);
      const { data } = await api.post<{ data: { id: number } }>(
        '/enterprises',
        { data: { ...form } },
      );

      if (data.data?.id && form?.company?.value) {
        const company = companies?.find(
          item => item.id === Number(form?.company?.value),
        );
        const enterprisesIds = company?.enterprises?.map(item => item.id) || [];

        await api.put(`/companies/${form.company.value}`, {
          data: {
            enterprises: [...enterprisesIds, data.data.id],
          },
        });
      }

      handleSuccess('Cadastro realizado com sucesso.');
      back();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate: SubmitHandler<IEnterpriseForm> = async form => {
    try {
      setIsLoading(true);
      api.put<{ data: { id: number } }>(`/enterprises/${companyId}`, {
        data: { ...form },
      });

      if (companyId && form?.company?.value) {
        const valueId = Number(form?.company?.value);
        const company = companies?.find(i => i.id === valueId);
        const enterprisesIds = company?.enterprises?.map(item => item.id) || [];
        const isAdded = !!company?.enterprises?.find(
          item => item.id === Number(companyId),
        );

        if (!isAdded) {
          await api.put(`/companies/${form.company.value}`, {
            data: {
              enterprises: [...enterprisesIds, Number(companyId)],
            },
          });
        }
      }

      handleSuccess('Alteração realizado com sucesso.');
      back();
    } catch (error) {
      handleError(error);
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

  return (
    <RegisterForm onSubmit={handleSubmit(isEditing ? onUpdate : onSubmit)}>
      <RegisterTitle>
        <UserIcon />
        Dados da empresa
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Nome</Label>
          <Input placeholder="Insirir nome" {...register('title')} />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Construtora</Label>
          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione construtora"
                onChange={onChange}
                value={value}
                options={
                  companies?.map(companies => ({
                    label: companies?.name || '',
                    value: `${companies?.id || ''}`,
                  })) || []
                }
              />
            )}
          />
          {errors?.company?.value?.message && (
            <ErrorMessage>{errors.company.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>CNJP</Label>
          <Input
            placeholder="Insirir cnpj"
            maskFunction={cnpjMask}
            {...register('cnpj')}
          />
          {errors?.cnpj?.message && (
            <ErrorMessage>{errors.cnpj.message}</ErrorMessage>
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
      </FormSection>

      <FormSection>
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
      </FormSection>

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

export default EnterpriseForm;
