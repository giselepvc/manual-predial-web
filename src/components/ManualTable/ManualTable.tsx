import { Control, Controller, UseFormWatch } from 'react-hook-form';
import Image from 'next/image';
import { CaptersDatum, IManualList, TitlesDatum } from '@/interfaces/manual';
import { Dispatch, SetStateAction } from 'react';
import { IManualForm } from '@/validations/ManualSchema';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import Select from '../Select/Select';
import Button from '../Button/Button';
import {
  Field,
  FormSection,
  Header,
  InfoSection,
  Label,
  RegisterTitle,
  StepsPage,
  TableDetails,
  TableMore,
  TableRow,
  TableSection,
} from './styles';

export const typeList = [
  {
    label: 'Capítulo',
    value: 'capitulo',
  },
  {
    label: 'Título',
    value: 'titulo',
  },
  {
    label: 'Container',
    value: 'container',
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
  return (
    <StepsPage>
      <Header>
        <RegisterTitle>
          Empreendimento: <span>{watch('enterprise.value')}</span>
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
                options={typeList}
              />
            )}
          />
        </Field>
      </FormSection>

      <TableSection>
        {manual?.capters.map(item => (
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
        ))}
      </TableSection>
    </StepsPage>
  );
};

export default ManualTable;
