import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

// socket을 local로 갖고 있기 위한 변수
const sockets: { [key: string]: SocketIOClient.Socket } = {};

/**
 * 소켓 객체를 만들어 반환한다.
 *
 * @param   {string[]}        workspace  [workspace description]
 *
 * @return  {SocketIOClient, () => void}             [return description]
 */
const useSocket = (workspace: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];

  // single ton 으로 사용하기 위해
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'], // HTTP 요청없이 websocket만 사용하도록 설정
    });
  }
  // // 이벤트 발행
  // sockets[workspace].emit('hello', 'world');
  // // 이벤트 구독
  // sockets[workspace].on('message', (data) => {});
  // // socket.disconnect(); // 연결 해제

  // console.log(`연결된 소켓(workspace) map:: ${Object.keys(sockets)}`);
  return [sockets[workspace], disconnect];
};

export default useSocket;
