import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChapterSchema, IChapterForm } from '@/validations/ChapterSchema';
import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { useState } from 'react';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { IManualList } from '@/interfaces/manual';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroups } from '@/services/querys/groups';
import { getIcons } from '@/services/querys/icons';
import Image from 'next/image';
import { urlBuild } from '@/utils/urlBuild';
import { CaptersDatum } from '@/interfaces/grups';
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
} from './styles';

interface ChapterPageProps {
  onClose: () => void;
  chapter: RecursiveNormalize<CaptersDatum> | undefined;
  manual: RecursiveNormalize<IManualList> | undefined;
}

const ChapterForm = ({ onClose, manual, chapter }: ChapterPageProps) => {
  const query = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chaptesIds = manual?.capters?.map(capter => capter.id) || [];
  const isEditing = !!chapter?.id;

  const groupsParams = {
    populate: '*',
    'filters[enterprise][id]': manual?.enterprise?.id,
  };

  const { data: groupsData } = useQuery({
    queryKey: ['groupList', groupsParams],
    queryFn: async () => getGroups(groupsParams),
  });

  const groups = normalizeStrapi(groupsData || []);

  const iconsParams = {
    populate: '*',
    'filters[active]': true,
  };

  const { data: icons } = useQuery({
    queryKey: ['iconsData', iconsParams],
    queryFn: async () => {
      const result = await getIcons(iconsParams);
      const iconsResult = normalizeStrapi(result || []);
      return iconsResult.sort((a, b) => a.id - b.id);
    },
  });

  const {
    control: controlManual,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChapterForm>({
    resolver: yupResolver(ChapterSchema),
    defaultValues: {
      title: chapter?.title,
      order: chapter?.order,
      ...(isEditing && {
        visible: {
          label: chapter?.visible ? 'Sim' : 'Não',
          value: chapter?.visible ? 'sim' : 'nao',
        },
      }),
      icon: chapter?.icon?.id || 0,
      ...{
        groups:
          chapter?.groups?.map(group => ({
            label: group?.name,
            value: group?.id?.toString(),
          })) || [],
      },
    },
  });

  const onSubmit: SubmitHandler<IChapterForm> = async form => {
    try {
      setIsLoading(true);
      const formData = {
        ...form,
        company: undefined,
        enterprise: undefined,
        groups: form?.groups?.map(item => Number(item.value)) || [],
        visible: form.visible?.value === 'sim',
      };

      const { data } = chapter?.id
        ? await api.put<any>(`/capters/${chapter?.id}`, { data: formData })
        : await api.post<any>('/capters', { data: formData });

      if (data.data?.id && manual?.id) {
        await api.put(`/manuals/${manual.id}`, {
          data: { capters: [...chaptesIds, data.data.id] },
        });
      }

      if (form?.icon && form?.icon !== 0 && data.data.id) {
        const iconSelected = icons?.find(item => item.id === form.icon);
        const captersList = iconSelected?.capters?.map(item => item.id) || [];
        await api.put(`/icons/${form?.icon}`, {
          data: { capters: [...captersList, data.data.id] },
        });
      }

      if (data.data?.id && form?.groups && form?.groups?.length > 0) {
        form?.groups?.map(async item => {
          const group = groups?.find(g => g?.id === Number(item?.value));
          const groupChapterIds = group?.capters?.map(c => c?.id) || [];
          await api.put(`/groups/${item.value}`, {
            data: { capters: [...groupChapterIds, data.data.id] },
          });
        });
      }

      query.invalidateQueries({ queryKey: ['manualForm'] });
      query.invalidateQueries({ queryKey: ['manualList'] });
      query.invalidateQueries({ queryKey: ['groupList'] });

      if (isEditing) {
        handleSuccess('Capítulo alterado com sucesso.');
      } else handleSuccess('Capítulo cadastrado com sucesso.');

      onClose();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(errors);

  return (
    <RegisterForm>
      <RegisterTitle>
        {isEditing ? 'Edição do capítulo' : 'Cadastro de capítulo'}
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Tipo de cadastro</Label>
          <Select
            width="270px"
            placeholder="Capítulo"
            value={{
              label: 'Capítulo',
              value: 'capitulo',
            }}
            options={[]}
            isDisabled
          />
        </Field>

        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ width: '270px' }}
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
                width="270px"
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

      <FormSection style={{ display: 'flex' }}>
        <Field>
          <Label>Grupo</Label>
          <Controller
            control={controlManual}
            name="groups"
            render={({ field: { onChange, value } }) => (
              <Select
                width="418px"
                placeholder="Selecione um grupo"
                onChange={onChange}
                value={value}
                isMulti
                options={
                  groups?.map(group => ({
                    label: group?.name || '',
                    value: `${group?.id || ''}`,
                  })) || []
                }
              />
            )}
          />
        </Field>

        <Field>
          <Label>Nome do capítulo</Label>
          <Input
            placeholder="Insira um nome"
            style={{ width: '418px' }}
            {...register('title')}
          />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
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
          text={isEditing ? 'Editar' : 'Cadastrar'}
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ChapterForm;
