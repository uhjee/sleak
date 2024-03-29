// import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
// import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import useSocket from '@hooks/useSocket';

const DMList: FC = () => {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  // 라우터 파라미터에서 워크스페이스 이름 가져오기
  const { workspace } = useParams<{ workspace?: string }>();
  const {
    data: userData,
    error,
    mutate,
  } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace as string);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]); // sockeIO를 통해 현재 접속한 유저 정보 받아온 리스트

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  useEffect(() => {
    console.log('DMList:: workspace 변경됨 => ', workspace);
    setOnlineList([]);
  }, [workspace]);

  // socketIO을 통해 온라인된 사용자 id들 받아오기
  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    // 이벤트 리스너 등록
    // socket?.on('dm', onMessage);
    // console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      // 이벤트 리스트 정리
      // socket?.off('dm', onMessage);
      // console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);

  // 선택된 유저 활성화
  const onClickChannel = useCallback((memberId: number) => {
    setSelectedMemberId(memberId);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink
                key={member.id}
                className={member.id === selectedMemberId ? 'selected' : ''}
                onClick={() => {
                  onClickChannel(member.id);
                }}
                to={`/workspace/${workspace}/dm/${member.id}`}
              >
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
