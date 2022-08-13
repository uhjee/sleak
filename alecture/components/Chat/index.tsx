import { IDM } from '@typings/db';
import { FC, memo, useMemo } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

interface IProps {
  data: IDM;
}

const Chat: FC<IProps> = ({ data }) => {
  const user = data.Sender;
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)\]\((\d+?)\)|\n/g, //  ID, 줄바꿈 부분 필터링
        decorator(match, index) {
          // 1. ID 필터링후 변환한 값 반환
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          // 2. 줄바꿈 변환한 후 리턴
          return <br key={index} />;
        },
      }),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt="{user.nickname}" />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

// 말단 컴포넌트는 memo 붙이기 (props가 변경되지 않으면 리렌더링 X)
export default memo(Chat);
