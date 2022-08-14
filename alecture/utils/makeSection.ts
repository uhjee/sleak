import { IDM } from '@typings/db';
import dayjs from 'dayjs';

/**
 * 채팅 데이터를 날짜 별로 분류한다.
 * @param chatList
 */
export default function makeSection(chatList: IDM[]): { [key: string]: IDM[] } {
  const sections: { [key: string]: IDM[] } = {};
  chatList.forEach((chat) => {
    const dateKey = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[dateKey])) {
      sections[dateKey].push(chat);
    } else {
      sections[dateKey] = [chat];
    }
  });
  return sections;
}
