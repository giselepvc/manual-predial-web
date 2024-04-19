import * as yup from 'yup';

export type IAbaForm = yup.InferType<typeof AbaSchema>;

export const AbaSchema = yup.object({
  order: yup
    .number()
    .typeError('A ordem deve ser um número')
    .required('A ordem é obrigatória')
    .nullable(),
  title: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
  icon: yup.number(),
});
