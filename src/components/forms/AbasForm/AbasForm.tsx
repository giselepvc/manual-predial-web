import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChapterSchema, IChapterForm } from '@/validations/ChapterSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
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

interface ChapterPageProps {
  onClose: () => void;
}

const AbasForm = ({ onClose }: ChapterPageProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChapterForm>({
    resolver: yupResolver(ChapterSchema),
  });

  const onSubmit: SubmitHandler<IChapterForm> = form => {
    console.log(form);

    handleSuccess('Aba cadastrada com sucesso.');

    onClose();
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastro de capítulo</RegisterTitle>

      <FormSection>
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

        <Field>
          <Label>Título</Label>
          <Input placeholder="Insira um título" />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Legenda</Label>
          <Input placeholder="Insira um título" style={{ minWidth: '850px' }} />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Selecione um ícone</Label>
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

export default AbasForm;
