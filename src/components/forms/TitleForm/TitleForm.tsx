import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleSuccess } from '@/utils/handleToast';
import { ITitleForm, TitleSchema } from '@/validations/TitleSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { IManualForm } from '@/validations/ManualSchema';
import { typeList } from '@/components/ManualTable/ManualTable';
import {
  ButtonSection,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  RegisterForm,
  RegisterTitle,
} from './styles';

interface ChapterPageProps {
  onClose: () => void;
  control: Control<IManualForm, any>;
}

const TitleForm = ({ onClose, control }: ChapterPageProps) => {
  const {
    control: controlTitle,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ITitleForm>({
    resolver: yupResolver(TitleSchema),
  });

  const onSubmit: SubmitHandler<ITitleForm> = form => {
    console.log(form);
    handleSuccess('Título cadastrado com sucesso.');
    onClose();
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastro de título</RegisterTitle>

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
                width="210px"
                options={typeList}
                isDisabled
              />
            )}
          />
          {errors?.type?.value?.message && (
            <ErrorMessage>{errors.type.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Capítulo</Label>
          <Controller
            control={controlTitle}
            name="chapter"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione um capítulo"
                onChange={onChange}
                value={value}
                width="210px"
                options={[
                  {
                    label: 'Capítulo 1',
                    value: 'capitulo 1',
                  },
                  {
                    label: 'Capítulo 2',
                    value: 'capitulo 2',
                  },
                ]}
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
            style={{ maxWidth: '210px', minWidth: '210px' }}
            {...register('title')}
          />
        </Field>

        <Field>
          <Label>Visível?</Label>
          <Controller
            control={controlTitle}
            name="visible"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma opção"
                onChange={onChange}
                value={value}
                width="210px"
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
          <Input placeholder="Insira um nome" style={{ minWidth: '880px' }} />
        </Field>
      </FormSection>

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

export default TitleForm;
