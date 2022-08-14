import Workspace from '@layouts/Workspace';
import React, { FormEvent, useCallback, useEffect, useRef } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import Scrollbars from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  // DM 상대방 데이터
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  // 내 정보
  const { data: myData } = useSWR(`/api/users`, fetcher);

  const [chat, onChangeChat, setChat] = useInput('');

  const [socket] = useSocket('workspace');

  // 등록된 채팅 받아오기 - infinite scroll 2차원 배열 반환
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IDM[]>(
    // (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${indext + 1}`,
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null;
      return `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`;
    },
    fetcher,
  );
  const scrollbarRef = useRef<Scrollbars>(null);
  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  // 채팅 보내기
  const onSubmitForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        // optimistic UI 를 위해 실제로 데이터가 들어간 것처럼 FE에 미리 반영
        const savedChat = chat;
        mutateChat((prevChatData) => {
          prevChatData?.[0].unshift({
            id: (chatData[0][0]?.id || 0) + 1,
            content: savedChat,
            SenderId: myData.id,
            Sender: myData,
            ReceiverId: userData.id,
            Receiver: userData,
            createdAt: new Date(),
          });
          return prevChatData;
        }, false).then(() => {
          setChat('');
          scrollbarRef.current?.scrollToBottom();
        });
        try {
          const res = await axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          });
          mutateChat();
        } catch (e) {
          console.error(e);
        }
      }
    },
    [chat, chatData, myData, userData, workspace, id],
  );

  // chatData를 섹션별로 분류, 최신순으로 정렬한다.
  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  const onMessage = useCallback((data: IDM) => {
    if (data.SenderId === Number(id) && myData.id !== Number(id)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }, false).then(() => {
        if (scrollbarRef.current) {
          // 남이 입력한 chat이 추가되었을 때, 150px 이상 올려놨으면 스크롤 유지
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            console.log('scrollToBottom! ', scrollbarRef.current?.getValues());
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      });
    }
  }, []);

  // socket을 통해 남의 채팅 가져오기
  useEffect(() => {
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
    };
  }, [socket, onMessage]);

  // 로딩 시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  // 로딩중이거나 에러인 경우 화면 렌더링 X
  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname} </span>
      </Header>
      {chatSections && (
        <ChatList
          chatSections={chatSections}
          ref={scrollbarRef}
          setSize={setSize}
          isEmpty={isEmpty}
          isReachingEnd={isReachingEnd}
        />
      )}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
