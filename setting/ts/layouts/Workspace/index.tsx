import React, {FC, useCallback} from "react";
import useSWR, {mutate} from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Redirect} from "react-router-dom";
import {Header, ProfileImg, RightMenu} from "@layouts/Workspace/styles";

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
          <ProfileImg src="" alt={data.nickname}/>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  )
}

export default Index;

