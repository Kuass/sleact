import React, {FC, useCallback} from "react";
import useSWR, {mutate} from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Redirect, Route, Switch} from "react-router-dom";
import {
  Channels,
  Chats,
  Header, MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar'
import loadable from "@loadable/component";

const Channel = loadable(() => import('@pages/Channel'))
const DirectMessage = loadable(() => import('@pages/DirectMessage'))

const Index: FC = ({children}) => {
  const {data, error, revalidate, mutate} = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });

  // const { data2 } = useSWR('hello', (key) =>  { localStorage.setItem('data', key); return localStorage.getItem('data') });

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, {
      withCredentials: true,
    }).then((response) => {
      mutate(false, false);
    })
  }, []);

  if (!data) {
    return <Redirect to="/login"/>
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname}/>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleat</WorkspaceName>
          <MenuScroll>
            MenuScroll
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel}/>
            <Route path="/workspace/dm" component={DirectMessage}/>
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  )
}

export default Index;

