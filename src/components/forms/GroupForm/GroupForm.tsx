import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FaTrash } from 'react-icons/fa6';
import { yupResolver } from '@hookform/resolvers/yup';

import { GroupSchema, IGroupForm } from '@/validations/GroupSchema';

import { normalizeStrapi } from '@/utils/normalizeStrapi';
import handleError, { handleSuccess } from '@/utils/handleToast';

import { useManualsToChapters } from '@/services/querys/manual';
import { getGroups } from '@/services/querys/groups';
import { useCompaniesOptions } from '@/services/querys/company';
import { useEnterprise } from '@/services/querys/enterprise';
import api from '@/services/api';

import Select from '@/components/Select/Select';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';

import {
  ButtonSection,
  FormSection,
  RegisterForm,
  Field,
  Label,
  ErrorMessage,
  Content,
  ContentSection,
  TableSection,
  TableRow,
  InfoSection,
} from './styles';

interface CustomerProps {
  isEditing?: boolean;
  groupId?: string;
}

const GroupForm = ({ isEditing, groupId }: CustomerProps) => {
  const { back } = useRouter();
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [groupsId] = useState<number>();
  const [deletingId, setDeletingId] = useState<number>();

  const {
    handleSubmit,
    register,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<IGroupForm>({
    resolver: yupResolver(GroupSchema),
  });

  const groupsParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id]': groupId || groupsId,
    populate: '*',
  };

  const { data: group } = useQuery({
    queryKey: ['groupData', groupsParams],
    queryFn: async () => {
      const groupsData = await getGroups(groupsParams);
      const groups = normalizeStrapi(groupsData || []);
      const result = groups?.[0];
      reset({
        name: result?.name || '',
        enterprise: {
          label: result?.enterprise?.title || '',
          value: result?.enterprise?.id.toString() || '',
        },
      });
      return result;
    },
    enabled: !!groupId || !!groupsId,
  });

  const { data: companies } = useCompaniesOptions({ populate: '*' });

  const enterpriseParams = {
    populate: '*',
    'filters[company][id]': watch('company.value'),
  };

  const { data: enterprises } = useEnterprise(
    enterpriseParams,
    !!watch('company'),
  );

  const chaptersParams = {
    populate: 'capters',
    'filters[enterprise][id]': watch('enterprise')?.value,
  };

  const { data: chapters } = useManualsToChapters(
    chaptersParams,
    !!watch('enterprise'),
  );

  const onSubmit: SubmitHandler<IGroupForm> = async form => {
    try {
      setIsLoading(true);

      const chaptersIds =
        chapters?.filter(item => item.type === 'Padrão') || [];

      const { data } = await api.post<{ data: { id: number } }>('/groups', {
        data: { name: form.name, capters: chaptersIds },
      });

      const enterpriseId = Number(form?.enterprise?.value);
      const groupId = data.data?.id;

      if (groupId && form?.enterprise?.value) {
        const enterprise = enterprises?.find(({ id }) => id === enterpriseId);
        const groupsIds = enterprise?.groups?.map(item => item.id) || [];
        const isAdded = !!enterprise?.groups?.find(({ id }) => id === groupId);

        if (!isAdded) {
          await api.put(`/enterprises/${enterpriseId}`, {
            data: { groups: [...groupsIds, groupId] },
          });
        }
      }

      handleSuccess('Cadastro realizado com sucesso.');
      back();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate: SubmitHandler<IGroupForm> = async form => {
    try {
      setIsLoading(true);

      await api.put(`/groups/${groupId}`, { data: { name: form.name } });

      const enterpriseId = Number(form?.enterprise?.value);

      if (groupId && enterpriseId) {
        const enterprise = enterprises?.find(item => item.id === enterpriseId);
        const groupsIds = enterprise?.groups?.map(({ id }) => id) || [];
        const isAdded = !!enterprise?.groups?.find(
          ({ id }) => id === Number(groupId),
        );

        if (!isAdded) {
          await api.put(`/enterprises/${enterpriseId}`, {
            data: { groups: [...groupsIds, groupId] },
          });
        }
      }

      handleSuccess('Alteração realizada com sucesso.');
      back();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveChapters = async () => {
    if (!deletingId) return;

    try {
      setIsLoading(true);

      const capters = group?.capters?.filter(c => c?.id !== deletingId) || [];
      await api.put(`/groups/${groupId}`, { data: { capters } });

      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['groupData'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit(!isEditing ? onSubmit : onUpdate)}>
      <FormSection>
        <Field>
          <Label>Nome do grupo</Label>
          <Input
            placeholder="Insirir nome"
            style={{ width: '300px' }}
            {...register('name')}
          />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Construtora</Label>
          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, value } }) => (
              <Select
                placeholder="Selecione uma construtora"
                width="300px"
                onChange={onChange}
                value={value}
                options={companies || []}
              />
            )}
          />
          {errors?.company?.value?.message && (
            <ErrorMessage>{errors.company.value.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Empreendimento</Label>
          <Controller
            control={control}
            name="enterprise"
            render={({ field: { onChange, value } }) => (
              <Select
                width="300px"
                placeholder="Selecione empreendimento"
                onChange={onChange}
                value={value}
                options={
                  enterprises?.map(item => ({
                    value: item?.id || '',
                    label: `${item?.title || ''}`,
                  })) || []
                }
              />
            )}
          />
          {errors?.enterprise?.message && (
            <ErrorMessage>{errors.enterprise.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      {isEditing && (
        <ContentSection>
          <Label>Capítulos atribuídos</Label>
          <Content>
            <TableSection>
              {group?.capters?.map((chapters, index) => (
                <TableRow>
                  <InfoSection>
                    <span>{index + 1}</span>
                    <div>{chapters?.title || ''}</div>
                  </InfoSection>
                  <div>
                    <FaTrash onClick={() => setDeletingId(chapters.id)} />
                  </div>
                </TableRow>
              ))}
            </TableSection>
          </Content>
        </ContentSection>
      )}

      <ButtonSection style={{ marginTop: isEditing ? '1rem' : '3rem' }}>
        <Button outlined text="Cancelar" type="button" onClick={back} />
        <Button
          text={isEditing ? 'Editar' : 'Cadastrar'}
          type="submit"
          disabled={isLoading}
        />
      </ButtonSection>

      {deletingId && (
        <ConfirmModal
          title="Atenção"
          onClose={() => setDeletingId(undefined)}
          onConfirm={onRemoveChapters}
          onCancel={() => setDeletingId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, remover"
          isLoading={isLoading}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>remover</strong> esse capítulo?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </RegisterForm>
  );
};

export default GroupForm;
