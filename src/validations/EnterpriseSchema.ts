import * as yup from 'yup';

export type IEnterpriseForm = yup.InferType<typeof EnterpriseSchema>;

export const EnterpriseSchema = yup.object({
  address: yup.string(),
  city: yup.string(),
  cnpj: yup.string(),
  neighborhood: yup.string(),
  number: yup.string(),
  phone: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  title: yup.string().required('Nome é obrigatório'),
  complement: yup.string().nullable(),
  email: yup.string().email('Email inválido'),
  company: yup.object({
    value: yup.string().required('Construtora é obrigatório'),
    label: yup.string().required('Construtora é obrigatório'),
  }),
});
