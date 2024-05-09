import * as yup from 'yup';

export type IContentForm = yup.InferType<typeof ContentSchema>;

export const ContentSchema = yup.object({
  order: yup.string().required('Ordem é obrigatório'),
  title: yup.string().required('Título é obrigatório'),
  description: yup.string(),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
  icon: yup.number().nullable(),
});
