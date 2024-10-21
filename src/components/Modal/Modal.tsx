import { ModalBackground } from './styles';

interface Props {
  zIndex?: number;
  children: React.ReactNode;
}

const Modal = ({ children, zIndex }: Props) => {
  return <ModalBackground $zIndex={zIndex}>{children}</ModalBackground>;
};

export default Modal;
