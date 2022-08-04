import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace: string) => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);
  // // 이벤트 발행
  // sockets[workspace].emit('hello', 'world');
  // // 이벤트 구독
  // sockets[workspace].on('message', (data) => {});
  // // socket.disconnect(); // 연결 해제

  return [sockets[workspace], disconnect];
};

export default useSocket;
