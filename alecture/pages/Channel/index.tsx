import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import React, { FormEvent, useCallback } from 'react';
import { Container, Header } from './styles';

const Channel = () => {
  const [chat, onChangeChat] = useInput('');

  const onSubmitForm = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);
  return (
    <Container>
      <Header>채널</Header>
      <ChatList></ChatList>
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm}></ChatBox>
    </Container>
  );
};

export default Channel;
