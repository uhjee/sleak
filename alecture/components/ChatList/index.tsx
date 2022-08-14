import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { FC, useCallback, forwardRef, MutableRefObject } from 'react';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from './styles';

interface IProps {
  chatSections?: { [key: string]: IDM[] };
  setSize: (size: number | ((_size: number) => number)) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, IProps>(({ chatSections, setSize, isReachingEnd, isEmpty }, scrollRef) => {
  // reverse infinite scrolling
  const onScroll = useCallback((values: positionValues) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSize) => prevSize + 1).then(() => {
        // 스크롤 위치 유지
        const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
        if (current) {
          current?.scrollTop(current?.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        <Section>
          {chatSections &&
            Object.entries(chatSections)?.map(([date, chats]) => {
              return (
                <Section className={`section-${date}`} key={date}>
                  <StickyHeader>
                    <button>{date}</button>
                  </StickyHeader>
                  {chats.map((chat) => (
                    <Chat key={chat.id} data={chat} />
                  ))}
                </Section>
              );
            })}
        </Section>
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
