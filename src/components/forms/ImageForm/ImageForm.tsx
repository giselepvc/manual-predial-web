import Button from '@/components/Button/Button';
import { useState } from 'react';
import handleError, { handleSuccess } from '@/utils/handleToast';
import api from '@/services/api';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { ContentsDatum } from '@/interfaces/manual';
import { useQueryClient } from '@tanstack/react-query';
import { urlBuild } from '@/utils/urlBuild';
import {
  ButtonSection,
  Field,
  FileButton,
  FormSection,
  Img,
  InputSection,
  Label,
  RegisterForm,
  RegisterTitle,
  TextArea,
} from './styles';

interface FileProps {
  onClose: () => void;
  content: RecursiveNormalize<ContentsDatum> | undefined;
}

const ImageForm = ({ onClose, content }: FileProps) => {
  const query = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();
  const [description, setDesciption] = useState<string>(
    content?.description || '',
  );

  const onSubmitPhoto = async () => {
    if (image) {
      try {
        const formData = new FormData();

        formData.append('ref', 'api::container.container');
        formData.append('refId', content?.id?.toString() || '');
        formData.append('field', 'image');
        formData.append('files', image);

        await api.post('/upload', formData);

        if (content?.image?.[0]?.id) {
          await api.delete(`/upload/files/${content?.image?.[0]?.id}`);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await api.put(`/containers/${content?.id}`, {
        data: {
          description,
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

  const renderImage = () => {
    return content?.image?.[0]?.url
      ? urlBuild(content?.image?.[0]?.url)
      : '/icons/image.svg';
  };

  const photoHandler = () => {
    if (image) {
      return URL.createObjectURL(image);
    }

    return content?.image?.[0]?.url
      ? urlBuild(content?.image?.[0]?.url)
      : '/icons/image.svg';
  };

  return (
    <RegisterForm>
      <RegisterTitle>
        Imagem única com legenda abaixo de vários parágrafos
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Imagem</Label>
          <Img src={image ? photoHandler() : renderImage()} alt="Image" />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Selecionar imagem</Label>
          <InputSection>
            <FileButton>Escolher arquivo</FileButton>
            <div>{image ? image.name : 'Nenhum arquivo escolhido'}</div>
            <input
              type="file"
              accept="image/*"
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

      <FormSection>
        <Field>
          <Label>Legenda com parágrafo múltiplo</Label>
          <TextArea
            placeholder="Insira uma legenda"
            style={{ width: '845px' }}
            value={description}
            onChange={e => setDesciption(e.target.value)}
          />
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

export default ImageForm;
