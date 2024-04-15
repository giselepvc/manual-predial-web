import * as yup from 'yup';

export type ICompanyForm = yup.InferType<typeof CompanySchema>;

export const CompanySchema = yup.object({
  address: yup.string().required('Endereço é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  cnpj: yup.string().required('CNPJ é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  number: yup.string().required('Número é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  state: yup.string().required('Estado é obrigatório'),
  zipCode: yup.string().required('CEP é obrigatório'),
  name: yup.string().required('Nome é obrigatório'),
  complement: yup.string(),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
});
