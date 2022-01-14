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
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}
const InviteWorkspaceModal: FC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { workspace } = useParams<{ workspace: string, channel: string }>();
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { revalidate: revalidateMembers } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if (!newMember || !newMember.trim()) return;
    axios.post(`/api/workspaces/${workspace}/members`, {
      email: newMember,
    }).then(() => {
      revalidateMembers();
      // 또는 mutate(response.data, false);
      setShowInviteWorkspaceModal(false);
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

export default InviteWorkspaceModal;
