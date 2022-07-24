import React, { FC } from 'react';
import { ChatZone, Section } from './styles';

interface IProps {}

const ChatList: FC<IProps> = () => {
  return (
    <ChatZone>
      <Section>section</Section>
    </ChatZone>
  );
};

export default ChatList;
