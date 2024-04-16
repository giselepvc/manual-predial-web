import Button from '@/components/Button/Button';
import { useState } from 'react';
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
}

const FileForm = ({ onClose }: FileProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File>();

  return (
    <RegisterForm>
      <RegisterTitle>Cadastrar arquivo PDF</RegisterTitle>

      <FormSection>
        <Field>
          <Label>Arquivo PDF</Label>
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

export default FileForm;
