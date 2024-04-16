import * as yup from 'yup';

export type IIconsForm = yup.InferType<typeof IconsSchema>;

const IconsSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
});

export default IconsSchema;
