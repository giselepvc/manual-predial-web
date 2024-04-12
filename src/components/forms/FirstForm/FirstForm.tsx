'use client';

import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { IManualForm } from '@/validations/ManualSchema';
import { useQuery } from '@tanstack/react-query';
import { getEnterprise } from '@/services/querys/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
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
}

const FirstForm = ({
  control,
  errors,
  onSubmit,
  register,
  handleSubmit,
  isLoading,
}: FirstProps) => {
  const { back } = useRouter();

  const enterpriseParams = {
    populate: '*',
  };

  const { data: enterprises } = useQuery({
    queryKey: ['myItems', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      const enterpriseList = normalizeStrapi(data || []);
      const resultEnterprise = enterpriseList?.map(enter => ({
        label: enter.title || '',
        value: enter.id ? `${enter.id}` : '',
      }));
      return resultEnterprise;
    },
  });

  return (
    <StepsPage>
      <FormSection>
        <Field>
          <Label>Empreendimento</Label>
          <Controller
            control={control}
            name="enterprise"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um empreendimento"
                width="700px"
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

      <FormSection>
        <Field>
          <Label>Nome do manual</Label>
          <Input
            placeholder="Insira um nome"
            style={{ minWidth: '700px' }}
            {...register('name')}
          />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
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
