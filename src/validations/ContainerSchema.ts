import * as yup from 'yup';

export type IContainerForm = yup.InferType<typeof ContainerSchema>;

export const ContainerSchema = yup.object({
  chapter: yup.object({
    value: yup.string().required('Capítulo é obrigatório'),
    label: yup.string().required('Capítulo é obrigatório'),
  }),
  title: yup.object({
    value: yup.string().required('Título é obrigatório'),
    label: yup.string().required('Título é obrigatório'),
  }),
  order: yup.number().required('Ordem é obrigatório'),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
  container: yup.object({
    value: yup.string().required('Tipo do container é obrigatório'),
    label: yup.string().required('Tipo do container é obrigatório'),
  }),
});
