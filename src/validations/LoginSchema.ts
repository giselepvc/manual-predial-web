import * as yup from 'yup';

export type ILoginForm = yup.InferType<typeof LoginSchema>;

export const LoginSchema = yup.object({
  email: yup.string().required('E-mail é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

export type IForgotForm = yup.InferType<typeof ForgotSchema>;

export const ForgotSchema = yup.object({
  email: yup
    .string()
    .required('E-mail é obrigatório')
    .email('Insira um e-mail válido'),
});

export type IChangePasswordForm = yup.InferType<typeof ChangePasswordSchema>;

export const ChangePasswordSchema = yup.object({
  oldPassword: yup.string().required('Senha é obrigatória'),
  password: yup.string().required('Senha é obrigatória'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas devem coincidir')
    .required('Confirmação de senha é obrigatória'),
});
