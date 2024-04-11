import { Icon } from '@iconify/react';

import Modal from '../Modal/Modal';
import {
  Button,
  ButtonsContainer,
  ConfirmModalContainer,
  Message,
  ModalHeader,
} from './styles';

interface Props {
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
  isLoading?: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal = ({
  children,
  onConfirm,
  onClose,
  isLoading,
  onCancel,
  title = 'Atenção',
  confirmText = 'SIM',
  cancelText = 'NÃO',
}: Props) => {
  return (
    <Modal>
      <ConfirmModalContainer>
        <ModalHeader>
          <Icon icon="prime:exclamation-triangle" />
          {title}
        </ModalHeader>
        {children}
        <ButtonsContainer>
          <Button
            type="button"
            $variant="outlined"
            onClick={onCancel || onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            $variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </ButtonsContainer>
      </ConfirmModalContainer>
    </Modal>
  );
};

ConfirmModal.Message = Message;

export default ConfirmModal;
