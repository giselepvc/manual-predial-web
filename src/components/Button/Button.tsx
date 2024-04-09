import { ButtonHTMLAttributes } from 'react';
import { ButtonComponent } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button = ({ text, ...rest }: ButtonProps) => {
  return <ButtonComponent {...rest}>{text}</ButtonComponent>;
};

export default Button;
