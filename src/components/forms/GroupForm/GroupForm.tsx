import Select from '@/components/Select/Select';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnterprise } from '@/services/querys/enterprise';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { GroupSchema, IGroupForm } from '@/validations/GroupSchema';
import { FaTrash } from 'react-icons/fa6';
import { getGroups } from '@/services/querys/groups';
import ConfirmModal from '@/components/ConfirmeModal/ConfirmeModal';
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
      return groups?.[0];
    },
    enabled: !!groupId || !!groupsId,
  });

  const enterpriseParams = {
    populate: '*',
  };

  const { data: enterprises } = useQuery({
    queryKey: ['enterprisesData', enterpriseParams],
    queryFn: async () => {
      const data = await getEnterprise(enterpriseParams);
      const enterprisesList = normalizeStrapi(data || []);
      const resultEnterprise = enterprisesList?.map(enter => ({
        label: enter.title || '',
        value: enter.id ? `${enter.id}` : '',
      }));
      return resultEnterprise;
    },
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<IGroupForm>({
    resolver: yupResolver(GroupSchema),
    defaultValues: {
      ...(isEditing && {
        name: group?.name || '',
        enterprise: {
          label: group?.enterprise?.title || undefined,
          value: group?.enterprise?.id ? `${group.enterprise.id}` : undefined,
        },
      }),
    },
  });

  const onSubmit: SubmitHandler<IGroupForm> = async form => {
    setIsLoading(true);

    try {
      const { data } = await api.post<{ data: { id: number } }>('/groups', {
        data: {
          name: form.name,
        },
      });

      if (data.data?.id && form?.enterprise?.value) {
        await api.put(`/enterprises/${form?.enterprise?.value}`, {
          data: {
            groups: [data.data.id],
          },
        });
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
    setIsLoading(true);

    try {
      const { data } = await api.put<{ data: { id: number } }>(
        `/groups/${groupId}}`,
        {
          data: {
            name: form.name,
          },
        },
      );

      if (data.data?.id && form?.enterprise?.value) {
        await api.put(`/enterprises/${form?.enterprise?.value}`, {
          data: {
            groups: [data.data.id],
          },
        });
      }

      handleSuccess('Edição realizada com sucesso.');
      back();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveChapters = async () => {
    if (!deletingId) {
      return;
    }

    setIsLoading(true);

    try {
      await api.put(`/groups/${groupId}`, {
        data: {
          capters:
            group?.capters?.filter(chapter => chapter?.id !== deletingId) || [],
        },
      });

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
            style={{ width: '250px' }}
            {...register('name')}
          />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>

        <Field>
          <Label>Empreendimento</Label>
          <Controller
            control={control}
            name="enterprise"
            render={({ field: { onChange, value } }) => (
              <Select
                width="250px"
                placeholder="Selecione empreendimento"
                onChange={onChange}
                value={value}
                options={enterprises || []}
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
                    <FaTrash
                      onClick={() => !isLoading && setDeletingId(chapters.id)}
                    />
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
