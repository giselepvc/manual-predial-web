import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { CompanySchema, ICompanyForm } from '@/validations/CompanySchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAddressFromCep } from '@/services/addressApi';
import zipcodeMask from '@/utils/masks/cep';
import handleError, { handleSuccess } from '@/utils/handleToast';
import { useState } from 'react';
import api from '@/services/api';
import cnpjMask from '@/utils/masks/cnpjMask';
import telephoneMask from '@/utils/masks/phone';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCompanies } from '@/services/querys/company';
import { normalizeStrapi } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import UserIcon from '../../../../public/icons/peaple.svg';
import HouseIcon from '../../../../public/icons/house.svg';
import ImageIcon from '../../../../public/icons/foto.svg';
import {
  ButtonSection,
  FormSection,
  RegisterForm,
  RegisterTitle,
  Field,
  Label,
  ErrorMessage,
  PhotoSection,
  PhotoChangeButton,
  Photo,
  InputSection,
  FileButton,
  ImageRow,
} from './styles';

interface Response {
  data: { id: number };
}

interface CompanProps {
  isEditing?: boolean;
  companyId?: string;
}

const CompanyForm = ({ isEditing, companyId }: CompanProps) => {
  const { back } = useRouter();
  const query = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File>();

  const {
    handleSubmit,
    register,
    trigger,
    setValue,
    setError,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ICompanyForm>({
    resolver: yupResolver(CompanySchema),
  });

  const companiesParams = {
    'pagination[page]': 1,
    'pagination[pageSize]': 1,
    'filters[id][$containsi]': companyId,
    populate: '*',
  };

  const { data: companyInfo } = useQuery({
    queryKey: ['usersData', companiesParams],
    queryFn: async () => {
      const companysData = await getCompanies(companiesParams);
      const companies = normalizeStrapi(companysData || []);
      const company = companies?.[0];
      reset({
        address: company?.address,
        complement: company?.complement || undefined,
        number: company?.number,
        city: company?.city,
        cnpj: company?.cnpj,
        neighborhood: company?.neighborhood,
        phone: company?.phone,
        state: company?.state,
        zipCode: company?.zipCode,
        name: company?.name,
        email: company?.email,
      });
      return company;
    },
    enabled: !!companyId,
  });

  const renderImage = () => {
    return companyInfo?.image?.url
      ? urlBuild(companyInfo?.image?.url)
      : '/icons/image.svg';
  };

  const photoHandler = () => {
    if (image) return URL.createObjectURL(image);
    return '/icons/image.svg';
  };

  const onSubmit: SubmitHandler<ICompanyForm> = async form => {
    try {
      setIsLoading(true);
      const { data } = await api.post<Response>('/companies', {
        data: { ...form },
      });

      if (data.data?.id && image) {
        const formData = new FormData();
        formData.append('ref', 'api::company.company');
        formData.append('refId', data.data?.id?.toString() || '');
        formData.append('field', 'image');
        formData.append('files', image);
        await api.post('/upload', formData);
      }

      query.invalidateQueries({ queryKey: ['CompaniesData'] });
      handleSuccess('Cadastro realizado com sucesso.');
      back();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdate: SubmitHandler<ICompanyForm> = async form => {
    try {
      setIsLoading(true);
      const { data } = await api.put<Response>(`/companies/${companyId}`, {
        data: { ...form },
      });

      if (data.data?.id && image) {
        const formData = new FormData();
        formData.append('ref', 'api::company.company');
        formData.append('refId', data.data?.id?.toString() || '');
        formData.append('field', 'image');
        formData.append('files', image);
        await api.post('/upload', formData);
      }

      query.invalidateQueries({ queryKey: ['CompaniesData'] });
      handleSuccess('Alteração realizada com sucesso.');
      back();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const isValid = await trigger('zipCode');
    if (!isValid) return;
    const cep = getValues('zipCode');

    if (cep) {
      try {
        const address = await getAddressFromCep(cep);

        if (address.erro) {
          setError('zipCode', { message: 'CEP inválido', type: 'invalid-cep' });
          setValue('zipCode', '');
          setValue('city', '');
          setValue('state', '');
          setValue('address', '');
          setValue('neighborhood', '');
          return;
        }

        setValue('state', address.uf);
        setValue('zipCode', address.cep);
        setValue('city', address.localidade);
        setValue('address', address.logradouro);
        setValue('neighborhood', address.bairro);
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <RegisterForm onSubmit={handleSubmit(isEditing ? onUpdate : onSubmit)}>
      <RegisterTitle>
        <UserIcon />
        Dados da construtora
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>Nome</Label>
          <Input placeholder="Insirir nome" {...register('name')} />
          {errors?.name?.message && (
            <ErrorMessage>{errors.name.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>CNJP</Label>
          <Input
            placeholder="Insirir cnpj"
            maskFunction={cnpjMask}
            {...register('cnpj')}
          />
          {errors?.cnpj?.message && (
            <ErrorMessage>{errors.cnpj.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>E-mail</Label>
          <Input
            type="email"
            placeholder="Insirir e-mail"
            {...register('email')}
          />
          {errors?.email?.message && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Telefone</Label>
          <Input
            placeholder="Insirir telefone"
            maskFunction={telephoneMask}
            {...register('phone')}
          />
          {errors?.phone?.message && (
            <ErrorMessage>{errors.phone.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <RegisterTitle style={{ marginTop: '2rem' }}>
        <HouseIcon />
        Endereço
      </RegisterTitle>

      <FormSection>
        <Field>
          <Label>CEP</Label>
          <Input
            placeholder="Insirir cep"
            maskFunction={zipcodeMask}
            maxLength={9}
            {...register('zipCode', {
              onBlur: handleCepBlur,
            })}
          />
          {errors?.zipCode?.message && (
            <ErrorMessage>{errors.zipCode.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Rua</Label>
          <Input placeholder="Insirir rua" {...register('address')} />
          {errors?.address?.message && (
            <ErrorMessage>{errors.address.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Número</Label>
          <Input placeholder="Insirir número" {...register('number')} />
          {errors?.number?.message && (
            <ErrorMessage>{errors.number.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Bairro</Label>
          <Input placeholder="Insirir bairro" {...register('neighborhood')} />
          {errors?.neighborhood?.message && (
            <ErrorMessage>{errors.neighborhood.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <FormSection>
        <Field>
          <Label>Cidade</Label>
          <Input placeholder="Insirir cidade" {...register('city')} />
          {errors?.city?.message && (
            <ErrorMessage>{errors.city.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Estado</Label>
          <Input placeholder="Insirir estado" {...register('state')} />
          {errors?.state?.message && (
            <ErrorMessage>{errors.state.message}</ErrorMessage>
          )}
        </Field>
        <Field>
          <Label>Complemento</Label>
          <Input
            placeholder="Insirir complemento"
            {...register('complement')}
          />
          {errors?.complement?.message && (
            <ErrorMessage>{errors.complement.message}</ErrorMessage>
          )}
        </Field>
      </FormSection>

      <RegisterTitle style={{ marginTop: '2rem' }}>
        <ImageIcon />
        Imagem da construtora
      </RegisterTitle>

      <ImageRow>
        <PhotoSection>
          <PhotoChangeButton>
            <Photo src={image ? photoHandler() : renderImage()} alt="profile" />
          </PhotoChangeButton>
        </PhotoSection>

        <Field>
          <Label>Selecione uma imagem</Label>
          <InputSection>
            <FileButton>Escolher arquivo</FileButton>
            {image ? image.name : 'Selecionar arquivo'}
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
      </ImageRow>

      <ButtonSection>
        <Button outlined text="Cancelar" type="button" onClick={back} />
        <Button
          text={isEditing ? 'Editar' : 'Cadastrar'}
          type="submit"
          disabled={isLoading}
        />
      </ButtonSection>
    </RegisterForm>
  );
};

export default CompanyForm;
