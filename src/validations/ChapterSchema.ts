import * as yup from 'yup';

export type IChapterForm = yup.InferType<typeof ChapterSchema>;

export const ChapterSchema = yup.object({
  order: yup
    .number()
    .typeError('A ordem deve ser um número')
    .required('A ordem é obrigatória')
    .nullable(),
  title: yup.string().required('Nome é obrigatório'),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
  group: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
});
