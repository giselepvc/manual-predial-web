/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
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
import { urlBuild } from '@/utils/urlBuild';
import { useAuth } from '@/hooks/useAuth';
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
  ThreadSection,
  Thread,
  ThreadLine,
  Content,
  InfoText,
  TableContentMore,
  Img,
  Description,
  Icon,
} from './styles';

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
  manual: RecursiveNormalize<IManualList> | undefined;
  content: RecursiveNormalize<ContentsDatum> | undefined;
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

const ManualDetails = ({
  control,
  watch,
  cap,
  title,
  manual,
  content,
  setCap,
  setTitle,
  setBuildType,
  setSteps,
  setContent,
}: ManualTableProps) => {
  const { role } = useAuth();
  const isCompany = role === 1;

  const [listOtions, setListOptions] = useState(typeList);

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

      <Content style={{ minHeight: 'calc(100vh - 14rem)' }}>
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
                            {index + 1 === 1 && (
                              <ThreadLine />
                            )}
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
                              <div>{titles.title}</div>
                            </InfoSection>

                            <div>
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
                            .map((container) => (
                              <>
                                <Thread
                                  key={container.id}
                                  style={{ paddingLeft: '3rem' }}
                                  onClick={() => {
                                    setContent(props => props === container ? undefined : container);
                                  }}
                                >
                                  <TableDetails>
                                    <InfoSection>
                                      <span>{container.order}</span>
                                      <div>
                                        {container.type === 'abas'
                                          ? 'Abas'
                                          : container.type === 'keys'
                                            ? 'Parágrafo - par de chaves'
                                            : container.title}
                                      </div>
                                    </InfoSection>

                                    <div
                                      style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        alignItems: 'center',
                                      }}
                                    >
                                      {container.type === 'abas' && !isCompany && (
                                        <Button
                                          type="button"
                                          text="Adicionar o conteúdo"
                                          style={{ minHeight: '25px' }}
                                          onClick={() => {
                                            setContent(container);
                                            setSteps(5);
                                            setBuildType('content');
                                          }}
                                        />
                                      )}

                                      <Image
                                        src={
                                          container?.id === content?.id
                                            ? '/icons/up-arrow.svg'
                                            : '/icons/down-arrow.svg'
                                        }
                                        alt="icon"
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  </TableDetails>
                                </Thread>

                                {container?.id === content?.id && (
                                  <Thread style={{ paddingLeft: '3rem' }}>
                                    <TableContentMore
                                      key={container?.id}
                                    >
                                      {container.pdf?.name && (
                                        <InfoSection>
                                          <InfoText>{container.pdf?.name}</InfoText>
                                        </InfoSection>
                                      )}

                                      {container.type === 'abas' && (
                                        <InfoSection>
                                          <InfoText>
                                            {container?.icon?.image?.url && (
                                              <Icon src={urlBuild(container?.icon?.image?.url)} alt="imagem do container" />
                                            )}
                                            {container.title || ''}
                                          </InfoText>
                                        </InfoSection>
                                      )}

                                      {container?.image?.[0]?.url && (
                                        <InfoSection>
                                          <Img src={urlBuild(container?.image?.[0]?.url)} alt="imagem do container" />

                                          <Description>
                                            Legenda: {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}

                                      {container?.type === 'paragraph' && (
                                        <InfoSection>
                                          {container?.icon?.image?.url && (
                                            <Icon src={urlBuild(container?.icon?.image?.url)} alt="imagem do container" />
                                          )}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}

                                      {container?.type === 'paragraphIcon' && (
                                        <InfoSection>
                                          {container?.icon?.image?.url && (
                                            <Icon src={urlBuild(container?.icon?.image?.url)} alt="imagem do container" />
                                          )}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}

                                      {container?.type === 'keys' && (
                                        <InfoSection>
                                          {container?.icon?.image?.url && (
                                            <Icon src={urlBuild(container?.icon?.image?.url)} alt="imagem do container" />
                                          )}
                                          Chave: {container?.title}
                                          <Description>
                                            {container?.description}
                                          </Description>
                                        </InfoSection>
                                      )}
                                    </TableContentMore>
                                  </Thread>
                                )}
                              </>
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
    </StepsPage>
  );
};

export default ManualDetails;
