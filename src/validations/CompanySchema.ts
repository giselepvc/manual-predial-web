import * as yup from 'yup';

export type ICompanyForm = yup.InferType<typeof CompanySchema>;

export const CompanySchema = yup.object({
  address: yup.string(),
  city: yup.string(),
  cnpj: yup.string(),
  neighborhood: yup.string(),
  number: yup.string(),
  phone: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  name: yup.string().required('Nome é obrigatório'),
  complement: yup.string(),
  email: yup.string().email('Email inválido'),
});
