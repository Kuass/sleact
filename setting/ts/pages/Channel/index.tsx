import React, {useCallback} from 'react';
import {Container, Header} from "@pages/Channel/styles";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import UseInput from "@hooks/useInput";

const Channel = () => {
  const [chat, onChangeChat, setChat] = UseInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    setChat('');
  }, []);
  return (
    <Container>
      <Header>채널</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default Channel;
