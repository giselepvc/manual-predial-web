import * as yup from 'yup';

export type ITitleForm = yup.InferType<typeof TitleSchema>;

export const TitleSchema = yup.object({
  chapter: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
  order: yup.string().nullable().required('Ordem é obrigatório'),
  title: yup.string().required('Nome é obrigatório'),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
});
