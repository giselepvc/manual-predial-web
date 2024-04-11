import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ChapterSchema, IChapterForm } from '@/validations/ChapterSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleSuccess } from '@/utils/handleToast';
import {
  ButtonSection,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  RegisterForm,
  RegisterTitle,
} from './styles';
import Select from '../Select/Select';
import Input from '../Input/Input';
import Button from '../Button/Button';

interface ChapterPageProps {
  onClose: () => void;
}

const ChapterForm = ({ onClose }: ChapterPageProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChapterForm>({
    resolver: yupResolver(ChapterSchema),
    defaultValues: {
      type: {
        label: 'Capítulo',
        value: 'capitulo',
      },
    },
  });

  const onSubmit: SubmitHandler<IChapterForm> = form => {
    console.log(form);

    handleSuccess('Capítulo cadastrado com sucesso.');

    onClose();
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastro de capítulo</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Tipo de cadastro</Label>
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Capítulo"
                onChange={onChange}
                value={value}
                options={[
                  {
                    label: 'Capítulo',
                    value: 'capitulo',
                  },
                ]}
                isDisabled
              />
            )}
          />
          {errors?.type?.value?.message && (
            <ErrorMessage>{errors.type.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            {...register('title')}
          />
        </Field>

        <Field>
          <Label>Visível?</Label>
          <Controller
            control={control}
            name="visible"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma opção"
                onChange={onChange}
                value={value}
                options={[
                  {
                    label: 'Sim',
                    value: 'sim',
                  },
                  {
                    label: 'Não',
                    value: 'nao',
                  },
                ]}
              />
            )}
          />
          {errors?.visible?.value?.message && (
            <ErrorMessage>{errors.visible.value.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Nome do capítulo</Label>
          <Input placeholder="Insira um nome" style={{ minWidth: '850px' }} />
        </Field>
      </FormSection>

      {/* <FormSection>
        <Field>
          <Label>Selecione um ícone</Label>
        </Field>
      </FormSection> */}

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Cadastrar"
          type="button"
          onClick={handleSubmit(onSubmit)}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ChapterForm;
