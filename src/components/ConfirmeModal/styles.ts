import styled, { css } from 'styled-components';

export const ConfirmModalContainer = styled.div`
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
  display: flex;
  align-items: center;
  gap: 0.9375rem;

  color: #de3737;
  font-size: 2rem;
  font-weight: 400;

  svg {
    font-size: 4rem;
  }
`;

export const Message = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};

  strong {
    font-weight: 700;
  }
`;

export const ButtonsContainer = styled.div`
  margin-top: 1rem;

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
