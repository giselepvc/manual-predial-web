import * as yup from 'yup';

export type ICustomerForm = yup.InferType<typeof CustomerSchema>;

export const CustomerSchema = yup.object({
  address: yup.string(),
  city: yup.string(),
  cpf: yup.string(),
  cnpj: yup.string(),
  neighborhood: yup.string(),
  number: yup.string(),
  phone: yup.string().nullable(),
  cellPhone: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  name: yup.string(),
  login: yup.string().required('Login é obrigatório'),
  complement: yup.string().nullable(),
  email: yup.string(),
  password: yup
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
  title: yup.string(),
  company: yup.object({
    value: yup.string().required('Construtora é obrigatório'),
    label: yup.string().required('Construtora é obrigatório'),
  }),
  enterprise: yup.object({
    value: yup.string().required('Empreendimento obrigatório'),
    label: yup.string().required('Empreendimento obrigatório'),
  }),
  group: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
});
