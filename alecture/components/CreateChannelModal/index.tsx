import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { Dispatch, FC, FormEvent, SetStateAction, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface CreateChannelModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal: FC<CreateChannelModalProps> = ({ onCloseModal, show = false, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  // useParams :: router paramter 가져오는 훅
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  /**
   * [swr] userData 받아오기
   */
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000,
    loadingTimeout: 900000,
  });

  /**
   * [swr] channelData 받아오기
   * 조건부 요청: userData 가 없다면, null로 요청
   */
  const { data: channelData, mutate: mutateChannelData } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await axios.post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        );

        // swr로 전역관리 - 다른 컴포넌트에도 브로드캐스팅
        mutateChannelData();
        setShowCreateChannelModal(false);
        setNewChannel('');
      } catch (error: any) {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      }
    },
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
