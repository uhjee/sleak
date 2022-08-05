import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { FC } from 'react';
import { ChatZone, Section } from './styles';

interface IProps {
  chatData?: IDM[];
}

const ChatList: FC<IProps> = ({ chatData }) => {
  return (
    <ChatZone>
      <Section>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Section>
    </ChatZone>
  );
};

export default ChatList;
