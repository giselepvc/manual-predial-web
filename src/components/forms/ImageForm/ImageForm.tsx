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

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File>();
  const [description, setDesciption] = useState(content?.description || '');

  const onSubmitPhoto = async () => {
    if (image) {
      try {
        const formData = new FormData();
        formData.append('ref', 'api::container.container');
        formData.append('refId', content?.id?.toString() || '');
        formData.append('field', 'image');
        formData.append('files', image);

        await api.post('/upload', formData);
      } catch (error) {
        handleError('Imagem não suportada');
      }
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await api.put(`/containers/${content?.id}`, {
        data: { description },
      });

      onSubmitPhoto();
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
    const renderImage = content?.image?.url;
    return renderImage ? urlBuild(renderImage) : '/icons/image.svg';
  };

  const photoHandler = () => {
    return image ? URL.createObjectURL(image) : renderImage();
  };

  return (
    <RegisterForm>
      <RegisterTitle>
        Imagem única com legenda abaixo de vários parágrafos
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Imagem</Label>
          <Img src={photoHandler()} alt="Image" />
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
                const file = e.target?.files?.[0];
                if (file) setImage(file);
                e.target.value = '';
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
