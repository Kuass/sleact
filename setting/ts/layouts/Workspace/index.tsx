import React, {FC, useCallback, useState} from "react";
import useSWR, {mutate} from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Redirect, Route, Switch} from "react-router-dom";
import {
  Channels,
  Chats,
  Header, LogOutButton, MenuScroll,
  ProfileImg, ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar'
import loadable from "@loadable/component";
import Menu from "@components/Menu";

const Channel = loadable(() => import('@pages/Channel'))
const DirectMessage = loadable(() => import('@pages/DirectMessage'))

const Index: FC = ({children}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, [])

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname}/>
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname}/>
                  <div>
                    <span id="profile-name">{data.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
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

