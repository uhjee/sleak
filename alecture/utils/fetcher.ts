import axios from 'axios';

// SWR의 fetcher 함수 구현

const fetcher = (url: string) =>
  // 로그인된 유저의 정보 요청
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export default fetcher;
