import styled from 'styled-components';

export const FullPage = styled.main`
  width: 100%;
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  display: flex;

  @media (max-width: 1150px) {
    flex-direction: column;
  }
`;

export const LogoContainer = styled.section`
  position: relative;

  width: 60%;
  background: url('/img/office_login.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(30, 30, 30, 0.5);
    pointer-events: none;
  }

  @media (max-width: 1150px) {
    width: 100%;
    height: 150px;
  }
`;

export const FormContainer = styled.form`
  background: linear-gradient(164.75deg, #272727 55.14%, #7c4d30 288.05%);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);

  width: 40%;
  padding: 3.5rem 2rem 5.8125rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  @media (max-width: 1150px) {
    width: 100%;
    height: calc(100vh - 150px);
  }
`;

export const LogoImg = styled.img`
  position: relative;

  max-width: 100%;
  margin-top: -40%;

  object-fit: scale-down;

  @media (max-width: 1150px) {
    margin-top: 0%;
    max-width: 60%;
  }
`;

export const InputSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 90%;

  .icon {
    position: absolute;
    right: 20px;
    bottom: 7px;
    cursor: pointer;
  }
`;

export const LoginLabel = styled.label`
  padding-left: 0.8rem;

  font-size: 12pt;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  outline: none;
`;

export const LoginInput = styled.input`
  width: 343px;
  max-width: 100%;
  min-height: 37px;

  padding: 0 1.5rem;

  border-radius: 6px;
  border: 1px solid #9a9a9a;
  background-color: transparent;

  color: ${({ theme }) => theme.colors.white};
  outline: none;

  animation-timing-function: ease-out;
  animation-duration: 100ms;
`;

export const LoginTitle = styled.h1`
  margin-top: 3rem;

  font-size: 4rem;
  color: ${({ theme }) => theme.colors.white};
  font-weight: 800;
`;

export const RegisterText = styled.h3`
  font-size: 10pt;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
  cursor: pointer;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ErrorMessage = styled.h3`
  position: absolute;
  bottom: -1.25rem;
  left: 0.25rem;

  font-size: 8pt;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.error};
`;
