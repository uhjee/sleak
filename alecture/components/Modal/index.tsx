import React, { FC, MouseEvent, ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface ModalProps {
  children: ReactNode;
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<ModalProps> = ({ children, onCloseModal, show }) => {
  const stopPropagation = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
