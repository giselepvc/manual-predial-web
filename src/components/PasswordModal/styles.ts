import styled, { css } from 'styled-components';

export const ModalContainer = styled.div`
  width: 95vw;
  max-width: 28.625rem;
  border-radius: 0.9375rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => theme.colors.gray2b};

  padding: 3.25rem 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
`;

export const ModalHeader = styled.div`
  width: 100%;
  padding: 0 0 0 0.65rem;

  color: #ffffff;
  font-size: 1.22rem;
  font-weight: 400;

  svg {
    font-size: 4rem;
  }
`;

export const ButtonsContainer = styled.div`
  margin-top: 3rem;

  width: 100%;
  max-width: 23.125rem;

  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

interface ButtonProps {
  $variant: 'outlined' | 'primary';
}

const outlinedVariant = css`
  border: 2px solid ${({ theme }) => theme.colors.graydf};
  background: ${({ theme }) => theme.colors.gray2b};
  color: ${({ theme }) => theme.colors.graydf};
`;

const primaryVariant = css`
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const variantStyles = {
  outlined: outlinedVariant,
  primary: primaryVariant,
};

export const Button = styled.button<ButtonProps>`
  height: 35px;
  width: 100%;
  border-radius: 4px;

  font-weight: 500;
  text-align: center;
  font-size: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $variant }) => variantStyles[$variant]}
`;

export const Field = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  padding-left: 0.75rem;

  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.grayd9};
`;

export const ErrorMessage = styled.h3`
  position: absolute;
  bottom: -1.25rem;
  left: 0.25rem;

  font-size: 8pt;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.error};
`;

export const FormSection = styled.form`
  width: 100%;
  padding: 0 0.65rem 0 0.65rem;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
