import Button from '@/components/Button/Button';
import { useState } from 'react';
import { ContentsDatum } from '@/interfaces/manual';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import api from '@/services/api';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useQueryClient } from '@tanstack/react-query';
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

  const onSubmitPhoto = async () => {
    setIsLoading(true);

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

        handleSuccess('Conteúdo alterado com sucesso');
        query.invalidateQueries({ queryKey: ['manualForm'] });
        onClose();
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <RegisterForm>
      <RegisterTitle>Cadastrar arquivo PDF</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Arquivo PDF</Label>
          <InputSection>
            <FileButton>Escolher arquivo</FileButton>
            <div>
              {image
                ? image.name
                : content?.pdf?.name || 'Nenhum arquivo escolhido'}
            </div>
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
          </InputSection>
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Editar"
          type="button"
          onClick={() =>
            image ? onSubmitPhoto() : handleError('Selecione um arquivo')
          }
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default FileForm;
