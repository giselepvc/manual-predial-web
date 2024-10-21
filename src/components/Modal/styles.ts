import styled from 'styled-components';

interface ModalProps {
  $zIndex?: number;
}

export const ModalBackground = styled.div<ModalProps>`
  position: fixed;
  z-index: ${props => (props.$zIndex ? props.$zIndex : 99)};
  inset: 0;
  background: #0f0f0f9c;

  display: grid;
  place-items: center;
`;
