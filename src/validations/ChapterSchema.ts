import * as yup from 'yup';

export type IChapterForm = yup.InferType<typeof ChapterSchema>;

export const ChapterSchema = yup.object({
  type: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
  order: yup.number().required('Ordem é obrigatório'),
  title: yup.string().required('Nome é obrigatório'),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
});
