import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChapterSchema, IChapterForm } from '@/validations/ChapterSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { handleSuccess } from '@/utils/handleToast';
import { typeList } from '@/components/ManualTable/ManualTable';
import { IManualForm } from '@/validations/ManualSchema';
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

const ChapterForm = ({ onClose, control }: ChapterPageProps) => {
  const {
    control: controlManual,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChapterForm>({
    resolver: yupResolver(ChapterSchema),
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
                options={typeList}
                isDisabled
              />
            )}
          />
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
            control={controlManual}
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
