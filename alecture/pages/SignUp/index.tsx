import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { ChangeEvent, FC, FormEvent, useCallback, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useSWR from 'swr';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from './styles';

const SignUp: FC = () => {
  const { data, error, isValidating } = useSWR('http://localhost:3095/api/users', fetcher);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [missmatchError, setMissmatchError] = useState(false);

  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMissmatchError(!!passwordCheck && e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMissmatchError(e.target.value !== password);
    },
    [password],
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // 비동기 요청 전에 관련 state 초기화
      setSignUpError('');
      setSignUpSuccess(false);

      if (!missmatchError && nickname && email) {
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then((res) => {
            console.log('서버로 회원가입 api req');
            console.log({ res });
            setSignUpSuccess(true);
          })
          .catch((error) => {
            console.log(error.response);
            setSignUpError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, missmatchError],
  );

  if (isValidating) {
    return <div>로딩중...</div>;
  }

  if (data) {
    // SWR로 api 요청한 결과에 로그인된 회원정보가 있다면, routing
    return <Navigate to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {missmatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {email && password && passwordCheck && !nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
