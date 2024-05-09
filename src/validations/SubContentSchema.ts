import * as yup from 'yup';

export type IContentForm = yup.InferType<typeof SubContentSchema>;

export const SubContentSchema = yup.object({
  order: yup.string().required('Ordem é obrigatório'),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
  container: yup.object({
    value: yup.string().required('Tipo do container é obrigatório'),
    label: yup.string().required('Tipo do container é obrigatório'),
  }),
});
