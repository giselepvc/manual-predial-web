import { ModalBackground } from './styles';

interface Props {
  children: React.ReactNode;
}

const Modal = ({ children }: Props) => {
  return <ModalBackground>{children}</ModalBackground>;
};

export default Modal;
