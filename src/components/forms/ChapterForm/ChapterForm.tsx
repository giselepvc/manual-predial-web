import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';

import { IManualList } from '@/interfaces/manual';
import { CaptersDatum } from '@/interfaces/grups';
import { ChapterSchema, IChapterForm } from '@/validations/ChapterSchema';

import Select from '@/components/Select/Select';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

import api from '@/services/api';

import { useGroups } from '@/services/querys/groups';
import { useIcons } from '@/services/querys/icons';
import { urlBuild } from '@/utils/urlBuild';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import handleError, { handleSuccess } from '@/utils/handleToast';

import {
  ButtonSection,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  Field,
  FormSection,
  Image,
  Label,
  RadiosRow,
  RegisterForm,
  RegisterTitle,
} from './styles';

interface ChapterPageProps {
  onClose: () => void;
  type: string;
  chapter: RecursiveNormalize<CaptersDatum> | undefined;
  manual: RecursiveNormalize<IManualList> | undefined;
}

const ChapterForm = ({ onClose, manual, chapter, type }: ChapterPageProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!chapter?.id;

  const getVisibleOption = (visible: boolean) => ({
    label: visible ? 'Sim' : 'Não',
    value: visible ? 'sim' : 'nao',
  });

  const defaultValues = {
    title: chapter?.title,
    order: chapter?.order,
    icon: chapter?.icon?.id || 0,
    type: { value: chapter?.type, label: chapter?.type },
    visible:
      chapter?.visible !== null
        ? getVisibleOption(chapter?.visible || false)
        : getVisibleOption(true),
    groups:
      chapter?.groups?.map(({ name, id }) => ({
        label: name,
        value: id?.toString(),
      })) || [],
  };

  const {
    control: controlManual,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IChapterForm>({
    resolver: yupResolver(ChapterSchema),
    defaultValues: {
      visible: { label: 'Sim', value: 'sim' },
      type:
        type === 'default'
          ? { value: 'Padrão', label: 'Padrão' }
          : { value: 'Personalizado', label: 'Personalizado' },
      ...(isEditing && defaultValues),
    },
  });

  const groupsParams = {
    populate: '*',
    'filters[enterprise][id]': manual?.enterprise?.id,
  };

  const { data: groups } = useGroups(groupsParams, !!manual?.enterprise?.id);

  const iconsParams = {
    populate: '*',
    'pagination[page]': 1,
    'pagination[pageSize]': 100,
    'filters[active]': true,
  };

  const { data: icons } = useIcons(iconsParams);

  const onSubmit: SubmitHandler<IChapterForm> = async form => {
    try {
      setIsLoading(true);

      const formData = {
        ...form,
        title: form.title.toUpperCase(),
        company: undefined,
        enterprise: undefined,
        icon: form?.icon !== 0 ? undefined : form?.icon,
        visible: form.visible?.value === 'sim',
        type: form?.type?.value,
        groups: type.includes('default')
          ? groups?.map(item => Number(item?.id))
          : form?.groups?.map(item => Number(item.value)),
      };

      const { data } = chapter?.id
        ? await api.put<any>(`/capters/${chapter?.id}`, { data: formData })
        : await api.post<any>('/capters', { data: formData });

      if (data.data?.id && manual?.id) {
        const chaptersIds = manual?.capters?.map(capter => capter.id) || [];

        await api.put(`/manuals/${manual.id}`, {
          data: { capters: [...chaptersIds, data.data.id] },
        });
      }

      if (form?.icon && form?.icon !== 0 && data.data.id) {
        const iconSelected = icons?.find(item => item.id === form.icon);
        const chaptersList = iconSelected?.capters?.map(item => item.id) || [];

        await api.put(`/icons/${form?.icon}`, {
          data: { capters: [...chaptersList, data.data.id] },
        });
      }

      if (
        data.data?.id &&
        form?.groups &&
        form?.groups?.length > 0 &&
        !type.includes('default')
      ) {
        form?.groups?.map(async item => {
          const group = groups?.find(g => g?.id === Number(item?.value));
          const groupChapterIds = group?.capters?.map(c => c?.id) || [];

          await api.put(`/groups/${item.value}`, {
            data: { capters: [...groupChapterIds, data.data.id] },
          });
        });
      }

      if (type === 'default') {
        groups?.map(async item => {
          const group = groups?.find(g => g?.id === Number(item?.id));
          const groupChapterIds = group?.capters?.map(c => c?.id) || [];

          await api.put(`/groups/${item.id}`, {
            data: { capters: [...groupChapterIds, data.data.id] },
          });
        });
      }

      query.invalidateQueries({ queryKey: ['manualForm'] });
      query.invalidateQueries({ queryKey: ['manualList'] });
      query.invalidateQueries({ queryKey: ['groupList'] });

      if (isEditing) handleSuccess('Capítulo alterado com sucesso.');
      else handleSuccess('Capítulo cadastrado com sucesso.');

      onClose();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Label>Tipo do Capítulo</Label>
          <Controller
            control={controlManual}
            name="type"
            render={({ field: { onChange, value } }) => (
              <Select
                width="270px"
                placeholder="Selecione um tipo"
                onChange={onChange}
                value={value}
                options={[
                  { value: 'Padrão', label: 'Padrão' },
                  { value: 'Personalizado', label: 'Personalizado' },
                ]}
              />
            )}
          />
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
                  { label: 'Sim', value: 'sim' },
                  { label: 'Não', value: 'nao' },
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
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ width: '418px' }}
            {...register('order')}
          />
          {errors?.order?.message && (
            <ErrorMessage>{errors.order.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Nome do capítulo</Label>
          <Input
            placeholder="Insira um nome"
            style={{ width: '418px', textTransform: 'uppercase' }}
            {...register('title')}
          />
          {errors?.title?.message && (
            <ErrorMessage>{errors.title.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection style={{ display: 'flex' }}>
        {type !== 'default' && (
          <Field>
            <Label>Grupo</Label>
            <Controller
              control={controlManual}
              name="groups"
              render={({ field: { onChange, value } }) => (
                <Select
                  width="860px"
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
        )}
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
                <Image src={urlBuild(item.image?.url)} alt="icons" />
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
