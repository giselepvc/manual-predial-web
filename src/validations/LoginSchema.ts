import * as yup from 'yup';

export type ILoginForm = yup.InferType<typeof LoginSchema>;

export const LoginSchema = yup.object({
  email: yup
    .string()
    .required('E-mail é obrigatório')
    .email('Insira um e-mail válido'),
  password: yup.string().required('Senha é obrigatória'),
});

export type IForgotForm = yup.InferType<typeof ForgotSchema>;

export const ForgotSchema = yup.object({
  email: yup
    .string()
    .required('E-mail é obrigatório')
    .email('Insira um e-mail válido'),
});
