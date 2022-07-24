import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Dispatch, FC, FormEvent, PropsWithChildren, SetStateAction, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface InviteWorkspaceModalProps extends PropsWithChildren {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspceModal: Dispatch<SetStateAction<boolean>>;
}

const InviteWorkspaceModal: FC<InviteWorkspaceModalProps> = ({
  onCloseModal,
  show = false,
  setShowInviteWorkspceModal,
}) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace } = useParams();

  /**
   * [swr] userData 받아오기
   */
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
    loadingTimeout: 900000,
  });

  /**
   * 특정 workspace의 멤버들을 가져온다.
   */
  const { mutate: mutateWorkspaceMembers } = useSWR<IUser[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // validation
      if (!newMember || !newMember.trim()) return;

      try {
        await axios.post(
          `/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          },
        );
        mutateWorkspaceMembers();
        setShowInviteWorkspceModal(false);
        setNewMember('');
      } catch (error: any) {
        console.dir(error);
        toast.error(error.response?.data, {
          position: 'bottom-center',
        });
      }
    },
    [newMember],
  );

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
  );
};

export default InviteWorkspaceModal;
