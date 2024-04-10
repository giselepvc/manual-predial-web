import { ButtonHTMLAttributes } from 'react';
import { ButtonComponent } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  outlined?: boolean;
}

const Button = ({ text, outlined, ...rest }: ButtonProps) => {
  return (
    <ButtonComponent outlined={outlined} {...rest}>
      {text}
    </ButtonComponent>
  );
};

export default Button;
