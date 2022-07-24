import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Dispatch, FC, FormEvent, SetStateAction, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface InviteChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteChannelModal: Dispatch<SetStateAction<boolean>>;
}

const InviteChannelModal: FC<InviteChannelModalProps> = ({ onCloseModal, setShowInviteChannelModal, show = false }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace, channel } = useParams();

  /**
   * [swr] userData 받아오기
   */
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
    loadingTimeout: 900000,
  });

  /**
   * 특정 channel의 멤버들을 조회한다.
   */
  const { mutate: mutateMembers } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const onInvieMember = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newMember && !newMember.trim()) return;

      try {
        await axios.post(
          `/api/workspaces/${workspace}/channels/${channel}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          },
        );

        mutateMembers();
        setNewMember('');
        setShowInviteChannelModal(false);
      } catch (error: any) {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      }
    },
    [newMember],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInvieMember}>
        <Label id="member-label">
          <span>채널 멤버 초대</span>
          <Input id="member" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteChannelModal;
