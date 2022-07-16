import React, { CSSProperties, FC, MouseEvent, ReactNode, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface IProps {
  children: ReactNode;
  show: boolean;
  style: CSSProperties;
  onCloseModal: (e: any) => void;
  closeButton?: boolean;
}

const Menu: FC<IProps> = ({ children, style, show = false, onCloseModal, closeButton = true }) => {
  if (!show) return null;

  // Event bubbling 방지: 메뉴 내부를 클릭했을 때, 이벤트가 부모에게 전달되지 않도록
  const stopPropagation = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);
  return (
    // 메뉴의 background가 되는 El
    <CreateMenu>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
