import * as yup from 'yup';

export type IGroupForm = yup.InferType<typeof GroupSchema>;

export const GroupSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  enterprise: yup.object({
    value: yup.string().required('Empreendimento é obrigatório'),
    label: yup.string().required('Empreendimento é obrigatório'),
  }),
  company: yup.object({
    value: yup.string().required('Construtora é obrigatório'),
    label: yup.string().required('Construtora é obrigatório'),
  }),
});
