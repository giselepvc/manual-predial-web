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
import {
  ButtonSection,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  StepsPage,
} from './styles';

const optionsMocked = [
  {
    label: 'Mestres da web',
    value: 'Mestres da web',
  },
];

interface FirstProps {
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
}: FirstProps) => {
  const { back } = useRouter();

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
                options={optionsMocked}
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
        <Button text="Próximo" type="button" onClick={handleSubmit(onSubmit)} />
      </ButtonSection>
    </StepsPage>
  );
};

export default FirstForm;
