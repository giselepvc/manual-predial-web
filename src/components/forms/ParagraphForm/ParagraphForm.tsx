import Button from '@/components/Button/Button';
import { useState } from 'react';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { RecursiveNormalize, normalizeStrapi } from '@/utils/normalizeStrapi';
import { ContentsDatum } from '@/interfaces/manual';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { getIcons } from '@/services/querys/icons';
import { urlBuild } from '@/utils/urlBuild';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import {
  ButtonSection,
  Checkbox,
  CheckboxLabel,
  Field,
  FormSection,
  Label,
  RadiosRow,
  RegisterForm,
  RegisterTitle,
  TextArea,
} from './styles';

interface Response {
  data: { id: number };
}

interface FileProps {
  onClose: () => void;
  content: RecursiveNormalize<ContentsDatum> | undefined;
}

const ParagraphForm = ({ onClose, content }: FileProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const [icon, setIcon] = useState(content?.icon?.id || 0);
  const [italic, setItalic] = useState(content?.italic || false);
  const [description, setDesciption] = useState(content?.description || '');
  const [subtitle, setTitle] = useState(content?.subtitle || '');
  const [order, setOrder] = useState(content?.order || '');
  const [active, setActive] = useState({
    label: content?.visible ? 'Sim' : 'Não' || 'Sim',
    value: content?.visible ? 'sim' : 'nao' || 'sim',
  });

  const iconsParams = {
    populate: '*',
    'pagination[page]': 1,
    'pagination[pageSize]': 100,
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

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.put<Response>(`/containers/${content?.id}`, {
        data: {
          description,
          subtitle,
          italic,
          order,
          visible: active.value === 'sim' ? true : false || true,
          ...(icon !== 0 && { icon }),
        },
      });

      if (data.data?.id && icon && icon !== 0) {
        const iconFind = icons?.find(item => item.id === icon);
        const containerList = iconFind?.containers?.map(c => c?.id) || [];
        await api.put(`/icons/${icon}`, {
          data: { containers: [...containerList, data.data.id] },
        });
      }

      handleSuccess('Conteúdo alterado com sucesso.');
      query.invalidateQueries({ queryKey: ['manualForm'] });
      onClose();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterForm>
      <RegisterTitle>Parágrafos</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Ordem</Label>
          <Input
            placeholder="Insira uma ordem"
            type="number"
            style={{ width: '300px' }}
            value={order}
            onChange={e => setOrder(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Visível?</Label>
          <Select
            width="300px"
            placeholder="Selecione uma opção"
            onChange={e => e && setActive(e)}
            value={active}
            defaultValue={{ label: 'Sim', value: 'sim' }}
            options={[
              { label: 'Sim', value: 'sim' },
              { label: 'Não', value: 'nao' },
            ]}
          />
        </Field>
      </FormSection>

      {content?.type === 'keys' && (
        <FormSection>
          <Field>
            <Label>Chave</Label>
            <Input
              placeholder="Insira uma chave"
              style={{ width: '845px' }}
              value={subtitle}
              onChange={e => setTitle(e.target.value)}
            />
          </Field>
        </FormSection>
      )}

      <FormSection>
        <Field>
          <Label>Parágrafo único ou múltiplo</Label>
          <TextArea
            placeholder="Insira os parágrafos"
            style={{ width: '845px', height: '22rem' }}
            value={description}
            onChange={e => setDesciption(e.target.value)}
          />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>O texto será em Itálico?</Label>
          <RadiosRow>
            <CheckboxLabel>
              <Checkbox
                type="radio"
                onClick={() => setItalic(false)}
                checked={!italic}
              />
              Não
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="radio"
                onClick={() => setItalic(true)}
                checked={italic}
              />
              Sim
            </CheckboxLabel>
          </RadiosRow>
        </Field>
      </FormSection>

      {content?.type === 'paragraphIcon' && (
        <FormSection>
          <Field>
            <Label>Selecione um ícone</Label>
            <RadiosRow>
              <CheckboxLabel>
                <Checkbox type="radio" onClick={() => setIcon(0)} value={0} />
                Nenhum
              </CheckboxLabel>
              {icons?.map(item => (
                <CheckboxLabel>
                  <Checkbox
                    type="radio"
                    onClick={() => setIcon(item.id)}
                    checked={icon === item.id}
                    value={item.id}
                  />
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
      )}

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Editar"
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ParagraphForm;
