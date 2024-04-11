import * as yup from 'yup';

export type IManualForm = yup.InferType<typeof ManualSchema>;

export const ManualSchema = yup.object({
  enterprise: yup.object({
    value: yup.string().required('Empreendimento é obrigatório'),
    label: yup.string().required('Empreendimento é obrigatório'),
  }),
  name: yup.string().required('Nome é obrigatório'),
  type: yup.object({
    value: yup.string(),
    label: yup.string(),
  }),
});
