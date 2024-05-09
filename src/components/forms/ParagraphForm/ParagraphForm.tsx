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

interface FileProps {
  onClose: () => void;
  content: RecursiveNormalize<ContentsDatum> | undefined;
}

const ParagraphForm = ({ onClose, content }: FileProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [icon, setIcon] = useState<number>(content?.icon?.id || 0);
  const [description, setDesciption] = useState<string>(
    content?.description || '',
  );
  const [title, setTitle] = useState<string>(content?.title || '');

  const iconsParams = {
    populate: '*',
    'filters[active]': true,
  };

  const { data: icons } = useQuery({
    queryKey: ['iconsData', iconsParams],
    queryFn: async () => {
      const result = await getIcons(iconsParams);
      const iconsResult = normalizeStrapi(result || []);
      iconsResult.sort((a, b) => a.id - b.id);
      return iconsResult;
    },
  });

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const { data } = await api.put<{ data: { id: number } }>(
        `/containers/${content?.id}`,
        {
          data: {
            description,
            title,
            icon: icon === 0 ? undefined : icon,
          },
        },
      );

      if (data.data?.id && icon && icon !== 0) {
        const iconFind = icons?.find(item => item.id === icon);
        const containerList = iconFind?.containers?.map(item => item?.id) || [];

        await api.put(`/icons/${icon}`, {
          data: {
            containers: [...containerList, data.data.id],
          },
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

      {content?.type === 'keys' && (
        <FormSection>
          <Field>
            <Label>Chave</Label>
            <Input
              placeholder="Insira uma chave"
              style={{ width: '845px' }}
              value={title}
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

      {content?.type === 'paragraphIcon' && (
        <FormSection>
          <Field>
            <Label>Selecione um ícone</Label>
            <RadiosRow>
              <CheckboxLabel>
                <Checkbox type="radio" onSelect={() => setIcon(0)} value={0} />
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
