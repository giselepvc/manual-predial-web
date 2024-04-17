import * as yup from 'yup';

export type IEnterpriseForm = yup.InferType<typeof EnterpriseSchema>;

export const EnterpriseSchema = yup.object({
  address: yup.string().required('Endereço é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  cnpj: yup.string().required('CNPJ é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  number: yup.string().required('Número é obrigatório'),
  phone: yup.string().required('Telefone é obrigatório'),
  state: yup.string().required('Estado é obrigatório'),
  zipCode: yup.string().required('CEP é obrigatório'),
  title: yup.string().required('Nome é obrigatório'),
  complement: yup.string().nullable(),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  company: yup.object({
    value: yup.string().required('Construtora é obrigatório'),
    label: yup.string().required('Construtora é obrigatório'),
  }),
});
