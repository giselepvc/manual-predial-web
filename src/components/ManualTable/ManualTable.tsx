import { Control, Controller, UseFormWatch } from 'react-hook-form';
import Image from 'next/image';
import {
  CaptersDatum,
  ContentsDatum,
  IManualList,
  TitlesDatum,
} from '@/interfaces/manual';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IManualForm } from '@/validations/ManualSchema';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { FaTrash, FaPen, FaEye } from 'react-icons/fa6';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { urlBuild } from '@/utils/urlBuild';
import { useAuth } from '@/hooks/useAuth';
import Select from '../Select/Select';
import Button from '../Button/Button';
import ConfirmModal from '../ConfirmeModal/ConfirmeModal';
import {
  Field,
  FormSection,
  Header,
  InfoSection,
  Label,
  NotListText,
  RegisterTitle,
  StepsPage,
  TableDetails,
  TableMore,
  TableRow,
  TableSection,
  ThreadSection,
  Thread,
  ThreadLine,
  Content,
  ThreadLineTwo,
} from './styles';

export const typeList = [
  {
    label: 'Capítulo padrão',
    value: 'default',
  },
  {
    label: 'Capítulo personalizado',
    value: 'personalizado',
  },
];

interface ManualTableProps {
  control: Control<IManualForm, any>;
  watch: UseFormWatch<IManualForm>;
  cap: RecursiveNormalize<CaptersDatum> | undefined;
  title: RecursiveNormalize<TitlesDatum> | undefined;
  manual: RecursiveNormalize<IManualList> | undefined;
  setCap: Dispatch<
    SetStateAction<RecursiveNormalize<CaptersDatum> | undefined>
  >;
  setTitle: Dispatch<
    SetStateAction<RecursiveNormalize<TitlesDatum> | undefined>
  >;
  setContent: Dispatch<
    SetStateAction<RecursiveNormalize<ContentsDatum> | undefined>
  >;
  setBuildType: Dispatch<SetStateAction<string>>;
  setSteps: Dispatch<SetStateAction<number>>;
}

const ManualTable = ({
  control,
  watch,
  cap,
  title,
  manual,
  setCap,
  setTitle,
  setBuildType,
  setSteps,
  setContent,
}: ManualTableProps) => {
  const { role } = useAuth();
  const query = useQueryClient();
  const isCompany = role === 1;
  const [listOtions, setListOptions] = useState(typeList);
  const [deletingId, setDeletingId] = useState<number>();
  const [deletingTitleId, setDeletingTitleId] = useState<number>();
  const [deletingContainerId, setDeletingContainerId] = useState<number>();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (manual?.capters && manual?.capters.length > 0) {
      const list = [
        ...typeList,
        {
          label: 'Título',
          value: 'titulo',
        },
        {
          label: 'Container',
          value: 'container',
        },
      ];

      setListOptions(list);
    }
  }, [manual]);

  const onDelete = async () => {
    if (!deletingId) return;

    try {
      setIsUpdating(true);
      await api.delete(`/capters/${deletingId}`);
      handleSuccess('Capítulo deletado com sucesso.');
      setDeletingId(undefined);
      query.invalidateQueries({ queryKey: ['manualForm'] });
      query.invalidateQueries({ queryKey: ['manualList'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const onDeleteTitle = async () => {
    if (!deletingTitleId) return;

    try {
      setIsUpdating(true);
      await api.delete(`/titles/${deletingTitleId}`);
      handleSuccess('Título deletado com sucesso.');
      setDeletingTitleId(undefined);
      query.invalidateQueries({ queryKey: ['manualForm'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const onDeleteContainer = async () => {
    if (!deletingContainerId) return;

    try {
      setIsUpdating(true);
      await api.delete(`/containers/${deletingContainerId}`);
      handleSuccess('Conteúdo deletado com sucesso.');
      setDeletingContainerId(undefined);
      query.invalidateQueries({ queryKey: ['manualForm'] });
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <StepsPage>
      <Header>
        <RegisterTitle>
          Empreendimento: <span>{watch('enterprise.label')}</span>
        </RegisterTitle>
        <RegisterTitle>
          Nome do manual: <span>{watch('name')}</span>
        </RegisterTitle>
      </Header>

      {!isCompany && (
        <FormSection>
          <Field>
            <Label>Tipo de cadastro</Label>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <Select
                  placeholder="Selecione uma opção"
                  onChange={onChange}
                  value={value}
                  options={listOtions}
                />
              )}
            />
          </Field>
        </FormSection>
      )}

      <Content style={isCompany ? { minHeight: 'calc(100vh - 14rem)' } : {}}>
        <TableSection>
          {manual?.capters && manual.capters.length > 0 ? (
            manual.capters
              .sort((a, b) => a.order - b.order)
              .map(capter => (
                <>
                  <TableRow
                    key={capter.id}
                    selected={cap?.id === capter.id}
                    onClick={() => {
                      setCap(props => (props === capter ? undefined : capter));
                    }}
                  >
                    <InfoSection>
                      <span>{capter.order}</span>
                      <Image
                        src={
                          capter.icon?.image?.url
                            ? urlBuild(capter.icon?.image?.url)
                            : '/icons/image.svg'
                        }
                        alt="icon"
                        width={20}
                        height={20}
                      />
                      <div>{capter.title}</div>
                    </InfoSection>
                    <div>
                      {!isCompany && (
                        <FaPen
                          onClick={() => {
                            setCap(undefined);
                            setSteps(2);
                          }}
                        />
                      )}
                      {!isCompany && (
                        <FaTrash onClick={() => setDeletingId(capter.id)} />
                      )}
                      <Image
                        src={
                          cap?.id === capter.id
                            ? '/icons/up-arrow.svg'
                            : '/icons/down-arrow.svg'
                        }
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </div>
                  </TableRow>

                  {cap?.id === capter.id &&
                    capter.titles.map((titles, index) => (
                      <>
                        <Thread>
                          <ThreadSection>
                            {index + 1 === 1 && <ThreadLine />}
                          </ThreadSection>
                          <TableMore
                            key={titles.id}
                            onClick={() =>
                              setTitle(props =>
                                props === titles ? undefined : titles,
                              )
                            }
                          >
                            <InfoSection>
                              <span>{index + 1}</span>
                              <div>{titles.title.toUpperCase()}</div>
                            </InfoSection>
                            <div>
                              {!isCompany && (
                                <FaTrash
                                  onClick={() => setDeletingTitleId(titles.id)}
                                />
                              )}
                              <Image
                                src={
                                  title?.id === titles.id
                                    ? '/icons/up-arrow.svg'
                                    : '/icons/down-arrow.svg'
                                }
                                alt="icon"
                                width={20}
                                height={20}
                              />
                            </div>
                          </TableMore>
                        </Thread>

                        {title?.id === titles.id &&
                          titles.containers
                            .sort((a, b) => a.order - b.order)
                            .map((container, containerIndex) => (
                              <Thread
                                key={container.id}
                                style={{ paddingLeft: '3rem' }}
                              >
                                <ThreadSection>
                                  <ThreadLine />
                                  {!!(
                                    titles.containers.length !==
                                    containerIndex + 1
                                  ) && <ThreadLineTwo />}
                                </ThreadSection>
                                <TableDetails>
                                  <InfoSection>
                                    <span>{container.order}</span>
                                    <div>
                                      {container.type === 'abas' && 'Abas'}
                                      {container.type === 'keys' &&
                                        'Parágrafo - par de chaves'}
                                      {container.type !== 'abas' &&
                                        container.type !== 'keys' &&
                                        container.title}
                                    </div>
                                  </InfoSection>
                                  <InfoSection>
                                    {container.type === 'abas' &&
                                      !isCompany && (
                                        <Button
                                          type="button"
                                          text="Adicionar abas"
                                          style={{ minHeight: '25px' }}
                                          onClick={() => {
                                            setContent(container);
                                            setSteps(5);
                                            setBuildType('content');
                                          }}
                                        />
                                      )}
                                    {isCompany && (
                                      <FaEye
                                        size={20}
                                        onClick={() => {
                                          setContent(container);
                                          setSteps(5);
                                          setBuildType(container.type);
                                        }}
                                      />
                                    )}
                                    {!isCompany && (
                                      <FaPen
                                        onClick={() => {
                                          setContent(container);
                                          setSteps(5);
                                          setBuildType(container.type);
                                        }}
                                      />
                                    )}
                                    {!isCompany && (
                                      <FaTrash
                                        onClick={() =>
                                          setDeletingContainerId(container.id)
                                        }
                                      />
                                    )}
                                  </InfoSection>
                                </TableDetails>
                              </Thread>
                            ))}
                        <div style={{ marginBottom: '1rem' }} />
                      </>
                    ))}
                </>
              ))
          ) : (
            <NotListText>Não há capitulos cadastrados!</NotListText>
          )}
        </TableSection>
      </Content>

      {deletingId && (
        <ConfirmModal
          title="Atenção"
          onClose={() => setDeletingId(undefined)}
          onConfirm={onDelete}
          onCancel={() => setDeletingId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          isLoading={isUpdating}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>excluir</strong> esse capítulo?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}

      {deletingTitleId && (
        <ConfirmModal
          title="Atenção"
          onClose={() => setDeletingTitleId(undefined)}
          onConfirm={onDeleteTitle}
          onCancel={() => setDeletingTitleId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          isLoading={isUpdating}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>excluir</strong> esse título?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}

      {deletingContainerId && (
        <ConfirmModal
          title="Atenção"
          onClose={() => setDeletingContainerId(undefined)}
          onConfirm={onDeleteContainer}
          onCancel={() => setDeletingContainerId(undefined)}
          cancelText="Cancelar"
          confirmText="Sim, excluir"
          isLoading={isUpdating}
        >
          <ConfirmModal.Message>
            Tem certeza que deseja <strong>excluir</strong> esse conteúdo?
          </ConfirmModal.Message>
        </ConfirmModal>
      )}
    </StepsPage>
  );
};

export default ManualTable;
