import styled from 'styled-components';

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
`;

export const ButtonSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  width: 100%;
  margin: 3rem 0 2rem 0;
`;

export const RegisterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  color: ${({ theme }) => theme.colors.graydf};

  svg {
    ${({ theme }) => theme.colors.graydf};
  }
`;

export const FormSection = styled.section`
  width: 100%;
  max-width: 1166px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 0.8rem;
  grid-row-gap: 1.5rem;
`;

export const Field = styled.div`
  position: relative;

  width: 100%;
  max-width: 27.75rem;

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

export const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;

export const PhotoChangeButton = styled.label`
  background-color: transparent;
  border: none;

  position: relative;
  width: fit-content;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ImageRow = styled.section`
  width: 100%;
  max-width: 1166px;

  display: flex;
  gap: 2rem;
`;

export const InputSection = styled.label`
  border: none;
  background: ${({ theme }) => theme.colors.gray3d};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 0.625rem;

  padding: 0;
  width: 500px;
  height: 2.75rem;
  margin-top: 8px;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray9a};

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
`;

export const FileButton = styled.div`
  height: 2.75rem;
  width: 150px;

  background: ${({ theme }) => theme.colors.gray4a};
  border-bottom-left-radius: 0.625rem;
  border-top-left-radius: 0.625rem;

  font-size: 0.9rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray9a};

  display: flex;
  align-items: center;
  justify-content: center;
`;
