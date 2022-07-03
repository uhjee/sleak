import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Navigate } from 'react-router';
import useSWR from 'swr';

const Workspace: FC<PropsWithChildren> = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then((response) => {
        mutate(false);
      });
  }, []);

  // swr 결과가 없으면
  if (data === false) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
