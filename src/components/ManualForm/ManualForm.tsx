'use client';

import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Select from '@/components/Select/Select';
import { IManualForm, ManualSchema } from '@/validations/ManualSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IManualList, ITitleList } from '@/interfaces/manual';
import {
  FormSection,
  RegisterForm,
  Field,
  Label,
  ButtonSection,
  ErrorMessage,
  StepsPage,
  RegisterTitle,
  TableSection,
  TableRow,
  Header,
  InfoSection,
  TableMore,
  TableDetails,
} from './styles';
import ChapterForm from '../ChapterForm/ChapterForm';
import TitleForm from '../TitleForm/TitleForm';
import ContainerForm from '../ContainerForm/ContainerForm';

const optionsMocked = [
  {
    label: 'Mestres da web',
    value: 'Mestres da web',
  },
];

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

const ManualForm = () => {
  const { back } = useRouter();

  const [steps, setSteps] = useState<number>(0);
  const [cap, setCap] = useState<IManualList | undefined>();
  const [title, setTitle] = useState<ITitleList | undefined>();

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IManualForm>({
    resolver: yupResolver(ManualSchema),
  });

  const onSubmit: SubmitHandler<IManualForm> = form => {
    console.log(form);

    setSteps(1);
  };

  useEffect(() => {
    switch (watch('type.value')) {
      case 'capitulo':
        setSteps(2);
        break;

      case 'titulo':
        setSteps(3);
        break;

      case 'container':
        setSteps(4);
        break;

      default:
        break;
    }
  }, [watch('type')]);

  return (
    <RegisterForm onSubmit={handleSubmit(onSubmit)}>
      {steps === 0 && (
        <StepsPage>
          <FormSection>
            <Field>
              <Label>Empreendimento</Label>
              <Controller
                control={control}
                name="enterprise"
                render={({ field: { onChange, value } }) => (
                  <Select
                    placeholder="Selecione um empreendimento"
                    width="700px"
                    onChange={onChange}
                    value={value}
                    options={optionsMocked}
                  />
                )}
              />
              {errors?.enterprise?.value?.message && (
                <ErrorMessage>{errors.enterprise.value.message}</ErrorMessage>
              )}
            </Field>
          </FormSection>

          <FormSection>
            <Field>
              <Label>Nome do manual</Label>
              <Input
                placeholder="Insira um nome"
                style={{ minWidth: '700px' }}
                {...register('name')}
              />
              {errors?.name?.message && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </Field>
          </FormSection>

          <ButtonSection>
            <Button outlined text="Voltar" type="button" onClick={back} />
            <Button
              text="Próximo"
              type="button"
              onClick={handleSubmit(onSubmit)}
            />
          </ButtonSection>
        </StepsPage>
      )}

      {steps === 1 && watch('enterprise.value') && watch('name') && (
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
      )}

      {steps === 2 && (
        <ChapterForm
          onClose={() => {
            setSteps(1);
            setValue('type', undefined as any);
          }}
        />
      )}

      {steps === 3 && (
        <TitleForm
          onClose={() => {
            setSteps(1);
            setValue('type', undefined as any);
          }}
        />
      )}

      {steps === 4 && (
        <ContainerForm
          onClose={() => {
            setSteps(1);
            setValue('type', undefined as any);
          }}
        />
      )}
    </RegisterForm>
  );
};

export default ManualForm;
