import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import handleError, { handleSuccess } from '@/utils/handleToast';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getIcons } from '@/services/querys/icons';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import { AbaSchema, IAbaForm } from '@/validations/AbaSchema';
import {
  ButtonSection,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  Field,
  FormSection,
  Label,
  RadiosRow,
  RegisterForm,
  RegisterTitle,
  TextArea,
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
  } = useForm<IAbaForm>({
    resolver: yupResolver(AbaSchema),
  });

  const iconsParams = {
    populate: '*',
    'filters[active]': true,
  };

  const { data: icons } = useQuery({
    queryKey: ['iconsData', iconsParams],
    queryFn: async () => {
      const result = await getIcons(iconsParams);
      const iconsResult = normalizeStrapi(result || []);
      iconsResult.sort((a, b) => a.id - b.id);
      return iconsResult;
    },
  });

  const onSubmit: SubmitHandler<IAbaForm> = async form => {
    try {
      console.log(form);
      handleSuccess('Aba cadastrada com sucesso.');
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastro de Aba</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ width: '250px' }}
            {...register('order')}
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
                width="250px"
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
          <Input
            placeholder="Insira um título da aba"
            style={{ width: '250px' }}
            {...register('title')}
          />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Legenda</Label>
          <TextArea
            placeholder="Insira uma legenda"
            style={{ width: '845px' }}
          />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Selecione um ícone</Label>
          <RadiosRow>
            <CheckboxLabel>
              <Checkbox type="radio" {...register('icon')} value={0} />
              Nenhum
            </CheckboxLabel>
            {icons?.map(item => (
              <CheckboxLabel>
                <Checkbox type="radio" {...register('icon')} value={item.id} />
                <Image
                  src={urlBuild(item.image?.url)}
                  alt="icons"
                  width={14}
                  height={14}
                />
              </CheckboxLabel>
            ))}
          </RadiosRow>
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
