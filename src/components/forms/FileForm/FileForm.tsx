import Button from '@/components/Button/Button';
import { useState } from 'react';
import { ContentsDatum } from '@/interfaces/manual';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useQueryClient } from '@tanstack/react-query';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import {
  ButtonSection,
  Field,
  FileButton,
  FormSection,
  InputSection,
  Label,
  RegisterForm,
  RegisterTitle,
} from './styles';

interface FileProps {
  onClose: () => void;
  content: RecursiveNormalize<ContentsDatum> | undefined;
}

const FileForm = ({ onClose, content }: FileProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [order, setOrder] = useState(content?.order || '');
  const [active, setActive] = useState({
    label: content?.visible ? 'Sim' : 'Não' || 'Sim',
    value: content?.visible ? 'sim' : 'nao' || 'sim',
  });

  const onSubmitPhoto = async () => {
    if (image) {
      try {
        const formData = new FormData();

        formData.append('ref', 'api::container.container');
        formData.append('refId', content?.id?.toString() || '');
        formData.append('field', 'pdf');
        formData.append('files', image);

        await api.post('/upload', formData);

        if (content?.pdf?.id) {
          await api.delete(`/upload/files/${content?.pdf?.id}`);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await api.put(`/containers/${content?.id}`, {
        data: {
          order,
          visible: active.value === 'sim' ? true : false || true,
        },
      });

      if (image) {
        onSubmitPhoto();
      }
      handleSuccess('Container alterado com sucesso.');
      query.invalidateQueries({ queryKey: ['manualForm'] });
      onClose();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderName = () => {
    if (image) return image.name;
    return content?.pdf?.name || 'Nenhum arquivo escolhido';
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastrar arquivo PDF</RegisterTitle>

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

      <FormSection>
        <Field>
          <Label>Arquivo PDF (Máx. 1mb)</Label>
          <InputSection>
            <FileButton>Escolher arquivo em PDF</FileButton>
            <div>{renderName()}</div>
            <input
              type="file"
              accept="pdf/*"
              hidden
              onChange={e => {
                if (e.target?.files?.[0]) {
                  setImage(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <FileButton>Escolher arquivo</FileButton>
          </InputSection>
        </Field>
      </FormSection>

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

export default FileForm;
