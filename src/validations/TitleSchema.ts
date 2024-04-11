import * as yup from 'yup';

export type ITitleForm = yup.InferType<typeof TitleSchema>;

export const TitleSchema = yup.object({
  type: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
  chapter: yup.object({
    value: yup.string().required('Capítulo é obrigatório'),
    label: yup.string().required('Capítulo é obrigatório'),
  }),
  order: yup.number().required('Ordem é obrigatório'),
  title: yup.string().required('Nome é obrigatório'),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
});
