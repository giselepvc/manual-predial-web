import * as yup from 'yup';

export type ICustomerForm = yup.InferType<typeof CustomerSchema>;

export const CustomerSchema = yup.object({
  address: yup.string().required('Endereço é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  cpf: yup.string().required('CPF é obrigatório'),
  cnpj: yup.string().required('CNPJ é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  number: yup.string().required('Número é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  cellPhone: yup.string().required('Celular é obrigatório'),
  state: yup.string().required('Estado é obrigatório'),
  zipCode: yup.string().required('CEP é obrigatório'),
  name: yup.string().required('Nome é obrigatório'),
  complement: yup.string(),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
  title: yup.string(),
  enterprise: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
  group: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
});
