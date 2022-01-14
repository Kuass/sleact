import React, {FC, useCallback} from 'react';
import Modal from "@components/Modal";
import {Button, Input, Label} from '@pages/SignUp/styles';
import {toast} from "react-toastify";
import axios from "axios";
import {useParams} from "react-router";
import {IChannel, IUser} from "@typings/db";
import useSWR from "swr";
import useInput from "@hooks/useInput";
import fetcher from "@utils/fetcher";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: (flag: boolean) => void;
}
const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;
    axios.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
      email: newMember,
    }).then(() => {
      revalidateChannel();
      // 또는 mutate(response.data, false);
      setShowInviteChannelModal(false);
      setNewMember('')
    }).catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    });
  }, [workspace, newMember])

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  )
}

export default InviteChannelModal;
