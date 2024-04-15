import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChapterSchema, IChapterForm } from '@/validations/ChapterSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { typeList } from '@/components/ManualTable/ManualTable';
import { IManualForm } from '@/validations/ManualSchema';
import api from '@/services/api';
import { useState } from 'react';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { IManualList } from '@/interfaces/manual';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroups } from '@/services/querys/groups';
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
  manual: RecursiveNormalize<IManualList> | undefined;
}

const ChapterForm = ({ onClose, control, manual }: ChapterPageProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chaptesIds = manual?.capters?.map(capter => capter.id) || [];

  const groupsParams = {
    populate: '*',
  };

  const { data: groupsData } = useQuery({
    queryKey: ['groupList', groupsParams],
    queryFn: async () => getGroups(groupsParams),
  });

  const groups = normalizeStrapi(groupsData || []);

  const {
    control: controlManual,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChapterForm>({
    resolver: yupResolver(ChapterSchema),
  });

  const onSubmit: SubmitHandler<IChapterForm> = async form => {
    setIsLoading(true);

    try {
      const { data } = await api.post<{ data: { id: number } }>('/capters', {
        data: {
          ...form,
          visible: form.visible?.value === 'sim',
        },
      });

      if (data.data?.id && manual?.id) {
        await api.put(`/manuals/${manual.id}`, {
          data: {
            capters: [...chaptesIds, data.data.id],
          },
        });
      }

      if (data.data?.id && form?.group?.value) {
        const group = groups?.find(
          group => group?.id === Number(form?.group?.value),
        );
        const groupChapterIds = group?.capters?.map(capter => capter?.id) || [];

        await api.put(`/groups/${form.group.value}`, {
          data: {
            capters: [...groupChapterIds, data.data.id],
          },
        });
      }

      handleSuccess('Capítulo cadastrado com sucesso.');

      query.invalidateQueries({ queryKey: ['manualForm'] });
      query.invalidateQueries({ queryKey: ['manualList'] });
      query.invalidateQueries({ queryKey: ['groupList'] });

      onClose();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
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
                width="250px"
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
            style={{ width: '250px' }}
            {...register('order')}
          />
          {errors?.order?.message && (
            <ErrorMessage>{errors.order.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Visível?</Label>
          <Controller
            control={controlManual}
            name="visible"
            render={({ field: { onChange, value } }) => (
              <Select
                width="250px"
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
          <Label>Grupo</Label>
          <Controller
            control={controlManual}
            name="group"
            render={({ field: { onChange, value } }) => (
              <Select
                width="250px"
                placeholder="Selecione um grupo"
                onChange={onChange}
                value={value}
                options={
                  groups?.map(group => ({
                    label: group?.name || '',
                    value: `${group?.id || ''}`,
                  })) || []
                }
              />
            )}
          />
          {errors?.group?.value?.message && (
            <ErrorMessage>{errors.group?.value?.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Nome do capítulo</Label>
          <Input
            placeholder="Insira um nome"
            style={{ width: '250px' }}
            {...register('title')}
          />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Cadastrar"
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ChapterForm;
