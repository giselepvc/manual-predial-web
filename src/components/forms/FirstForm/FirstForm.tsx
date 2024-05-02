'use client';

import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { IManualForm } from '@/validations/ManualSchema';
import { useQuery } from '@tanstack/react-query';
import { getEnterprise } from '@/services/querys/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { getCompanies } from '@/services/querys/company';
import {
  ButtonSection,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  StepsPage,
} from './styles';

interface FirstProps {
  isLoading: boolean;
  control: Control<IManualForm, any>;
  errors: FieldErrors<IManualForm>;
  register: UseFormRegister<IManualForm>;
  handleSubmit: UseFormHandleSubmit<IManualForm, undefined>;
  onSubmit: SubmitHandler<IManualForm>;
  watch: UseFormWatch<IManualForm>;
}

const FirstForm = ({
  control,
  errors,
  onSubmit,
  register,
  handleSubmit,
  watch,
  isLoading,
}: FirstProps) => {
  const { back } = useRouter();

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
        value: enter.id ? `${enter.id}` : '',
      }));
    },
  });

  const enterpriseParams = {
    populate: '*',
    'filters[company][id]': watch('company.value'),
  };

  const { data: enterprises } = useQuery({
    queryKey: ['enterprisesOptions', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      const enterpriseList = normalizeStrapi(data || []);
      return enterpriseList?.map(enter => ({
        label: enter.title || '',
        value: enter.id ? `${enter.id}` : '',
      }));
    },
    enabled: !!watch('company'),
  });

  return (
    <StepsPage>
      <FormSection>
        <Field>
          <Label>Nome do manual</Label>
          <Input
            placeholder="Insira um nome"
            style={{ minWidth: '300px' }}
            {...register('name')}
          />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Construtora</Label>
          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma construtora"
                width="300px"
                onChange={onChange}
                value={value}
                options={companies || []}
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
                placeholder="Selecione um empreendimento"
                width="300px"
                onChange={onChange}
                value={value}
                options={enterprises || []}
              />
            )}
          />
          {errors?.enterprise?.value?.message && (
            <ErrorMessage>{errors.enterprise.value.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={back} />
        <Button
          text="Próximo"
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>
    </StepsPage>
  );
};

export default FirstForm;
