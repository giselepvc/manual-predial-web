import styled from 'styled-components';

export const RegisterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
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
  max-width: 1000px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

export const PhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 20px;
`;

export const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`;
export const PhotoContentWrapper = styled.div`
  display: grid;
  gap: 5px;
`;
export const PhotoTitle = styled.h2`
  font-size: 0.8rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.graydf};
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
  gap: 1rem;
`;
