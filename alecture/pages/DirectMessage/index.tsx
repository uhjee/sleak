import Workspace from '@layouts/Workspace';
import React, { FormEvent, useCallback } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  // DM 상대방 데이터
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  // 내 정보
  const { data: myData } = useSWR(`/api/users`, fetcher);

  const [chat, onChangeChat, setChat] = useInput('');

  // 등록된 채팅 받아오기
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    // (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${indext + 1}`,
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  // 채팅 보내기
  const onSubmitForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (chat?.trim()) {
        try {
          const res = await axios.post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          });
          mutateChat();
          setChat('');
        } catch (e) {
          console.error(e);
        }
      }
    },
    [chat],
  );

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
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
