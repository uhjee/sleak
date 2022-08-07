import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { FC, useCallback, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section } from './styles';

interface IProps {
  chatData?: IDM[];
}

const ChatList: FC<IProps> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        <Section>
          {chatData?.map((chat) => (
            <Chat key={chat.id} data={chat} />
          ))}
        </Section>
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
