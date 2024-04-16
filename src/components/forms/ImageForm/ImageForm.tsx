import Button from '@/components/Button/Button';
import { useState } from 'react';
import Image from 'next/image';
import {
  ButtonSection,
  Field,
  FileButton,
  FormSection,
  InputSection,
  Label,
  RegisterForm,
  RegisterTitle,
  TextArea,
} from './styles';

interface FileProps {
  onClose: () => void;
}

const ImageForm = ({ onClose }: FileProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();

  return (
    <RegisterForm>
      <RegisterTitle>
        Imagem única com legenda abaixo de vários parágrafos
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Imagem</Label>
          <Image
            src="/icons/image.svg"
            alt="Image"
            style={{ marginTop: '8px' }}
            width={140}
            height={140}
          />
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Selecionar imagem</Label>
          <InputSection>
            <FileButton>Escolher arquivo</FileButton>
            {image ? image.name : 'Nenhum arquivo escolhido'}
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
          />
        </Field>
      </FormSection>

      <ButtonSection>
        <Button outlined text="Voltar" type="button" onClick={onClose} />
        <Button
          text="Cadastrar"
          type="button"
          onClick={() => null}
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default ImageForm;
