import * as yup from 'yup';

export type IChapterForm = yup.InferType<typeof ChapterSchema>;

export const ChapterSchema = yup.object({
  order: yup
    .number()
    .typeError('A ordem deve ser um número')
    .required('A ordem é obrigatória')
    .nullable(),
  title: yup.string().required('Nome é obrigatório'),
  type: yup.object({
    value: yup.string().required('Tipo é obrigatório'),
    label: yup.string().required('Tipo é obrigatório'),
  }),
  visible: yup.object({
    value: yup.string().required('Status é obrigatório'),
    label: yup.string().required('Status é obrigatório'),
  }),
  company: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
  enterprise: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
  groups: yup.array().of(
    yup.object({
      value: yup.string(),
      label: yup.string(),
    }),
  ),
  icon: yup.number(),
});
