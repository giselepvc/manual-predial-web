import { Control, Controller, UseFormWatch } from 'react-hook-form';
import Image from 'next/image';
import { IManualList, ITitleList } from '@/interfaces/manual';
import { Dispatch, SetStateAction } from 'react';
import { IManualForm } from '@/validations/ManualSchema';
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
import Select from '../Select/Select';
import Button from '../Button/Button';

enum ITypes {
  CAPITULO = 'Capítulo',
  TITULO = 'Título',
  CONTAINER = 'Container',
}

const listMocked: IManualList[] = [
  {
    id: 1,
    type: ITypes.CAPITULO,
    order: 1,
    visible: true,
    name: 'Novo manual',
    icon: '/icons/diamond.svg',
    titles: [
      {
        id: 1,
        name: 'Título 1',
        order: 1,
        visible: true,
        content: [
          {
            order: 1,
            type: 'Abas',
            visible: true,
          },
          {
            order: 2,
            type: 'Arquivo PDF',
            visible: true,
          },
          {
            order: 3,
            type: 'Imagem unica com legenda abaixo paragrafo multiplo',
            visible: true,
          },
          {
            order: 4,
            type: 'Paragrafo - par de chaves',
            visible: true,
          },
          {
            order: 5,
            type: 'Paragrafo multiplo',
            visible: true,
          },
          {
            order: 6,
            type: 'Paragrafo multiplo itens não numerados',
            visible: true,
          },
          {
            order: 7,
            type: 'Paragrafo unico',
            visible: true,
          },
        ],
      },
      {
        id: 2,
        name: 'Título 2',
        order: 2,
        visible: true,
        content: [
          {
            order: 1,
            type: 'Abas',
            visible: true,
          },
        ],
      },
      {
        id: 3,
        name: 'Título 3',
        order: 3,
        visible: true,
        content: [
          {
            order: 1,
            type: 'Abas',
            visible: true,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    type: ITypes.CAPITULO,
    order: 2,
    visible: true,
    name: 'Manual antigo',
    icon: '/icons/diamond.svg',
    titles: [],
  },
  {
    id: 3,
    type: ITypes.CAPITULO,
    order: 3,
    visible: false,
    name: 'Capítulo 1',
    icon: '/icons/diamond.svg',
    titles: [
      {
        id: 1,
        name: 'Título 1',
        order: 1,
        visible: true,
        content: [],
      },
    ],
  },
];

const typeList = [
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
  cap: IManualList | undefined;
  title: ITitleList | undefined;
  setCap: Dispatch<SetStateAction<IManualList | undefined>>;
  setTitle: Dispatch<SetStateAction<ITitleList | undefined>>;
}

const ManualTable = ({
  control,
  watch,
  cap,
  setCap,
  setTitle,
  title,
}: ManualTableProps) => {
  const options = {};

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
        {listMocked.map(item => (
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
                <div>{item.name}</div>
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
              item.titles.map(itemTitle => (
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
                      <span>{itemTitle.order}</span>
                      <div>{itemTitle.name}</div>
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
                    itemTitle.content.map(cont => (
                      <TableDetails>
                        <InfoSection>
                          <span>{cont.order}</span>
                          <div>{cont.type}</div>
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
