import { Control, Controller, UseFormWatch } from 'react-hook-form';
import Image from 'next/image';
import { CaptersDatum, IManualList, TitlesDatum } from '@/interfaces/manual';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IManualForm } from '@/validations/ManualSchema';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { FaTrash } from 'react-icons/fa6';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import Select from '../Select/Select';
import Button from '../Button/Button';
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
} from './styles';
import ConfirmModal from '../ConfirmeModal/ConfirmeModal';

export const typeList = [
  {
    label: 'Capítulo',
    value: 'capitulo',
  },
];

interface ManualTableProps {
  control: Control<IManualForm, any>;
  watch: UseFormWatch<IManualForm>;
  cap: RecursiveNormalize<CaptersDatum> | undefined;
  title: RecursiveNormalize<TitlesDatum> | undefined;
  setCap: Dispatch<
    SetStateAction<RecursiveNormalize<CaptersDatum> | undefined>
  >;
  setTitle: Dispatch<
    SetStateAction<RecursiveNormalize<TitlesDatum> | undefined>
  >;
  manual: RecursiveNormalize<IManualList> | undefined;
}

const ManualTable = ({
  control,
  watch,
  cap,
  setCap,
  setTitle,
  title,
  manual,
}: ManualTableProps) => {
  const query = useQueryClient();

  const [listOtions, setListOptions] = useState(typeList);
  const [deletingId, setDeletingId] = useState<number>();
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
    if (!deletingId) {
      return;
    }

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

      <TableSection>
        {manual?.capters && manual.capters.length > 0 ? (
          manual.capters.map(item => (
            <>
              <TableRow
                key={item.id}
                selected={cap?.id === item.id}
                onClick={() =>
                  setCap(props => (props === item ? undefined : item))
                }
              >
                <InfoSection>
                  <span>{item.order}</span>
                  <Image
                    src="/icons/image.svg"
                    alt="icon"
                    width={20}
                    height={20}
                  />
                  <div>{item.title}</div>
                </InfoSection>

                <div>
                  <FaTrash
                    onClick={() => (isUpdating ? null : setDeletingId(item.id))}
                  />
                  <Image
                    src={
                      cap?.id === item.id
                        ? '/icons/up-arrow.svg'
                        : '/icons/down-arrow.svg'
                    }
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
              </TableRow>
              {cap?.id === item.id &&
                item.titles.map((itemTitle, index) => (
                  <>
                    <TableMore
                      key={itemTitle.id}
                      onClick={() =>
                        setTitle(props =>
                          props === itemTitle ? undefined : itemTitle,
                        )
                      }
                    >
                      <InfoSection>
                        <span>{index + 1}</span>
                        <div>{itemTitle.title}</div>
                      </InfoSection>

                      <Image
                        src={
                          title?.id === itemTitle.id
                            ? '/icons/up-arrow.svg'
                            : '/icons/down-arrow.svg'
                        }
                        alt="icon"
                        width={20}
                        height={20}
                      />
                    </TableMore>
                    {title?.id === itemTitle.id &&
                      itemTitle.contents.map((cont, contIdx) => (
                        <TableDetails>
                          <InfoSection>
                            <span>{contIdx + 1}</span>
                            <div>{cont.key}</div>
                          </InfoSection>

                          <Button
                            type="button"
                            text="Editar o conteúdo"
                            style={{ minHeight: '25px' }}
                            onClick={() => null}
                          />
                        </TableDetails>
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
    </StepsPage>
  );
};

export default ManualTable;
