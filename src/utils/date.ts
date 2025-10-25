export function formatDateToLocalISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isToday from 'dayjs/plugin/isToday';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);
dayjs.locale('ko');

export const formatDate = (isoString: string) => {
  return dayjs.utc(isoString).tz('Asia/Seoul').format('M월 D일');
};

export const formatTime = (isoString: string) => {
  return dayjs.utc(isoString).tz('Asia/Seoul').format('HH:mm');
};

export const formatDeadline = (isoString: string) => {
  const date = dayjs.utc(isoString).tz('Asia/Seoul');
  const now = dayjs().tz('Asia/Seoul');

  if (date.isBefore(now)) {
    return '마감';
  }

  if (date.isToday()) {
    return `오늘 ${date.format('HH시')} 마감`;
  }

  const tomorrow = now.add(1, 'day').startOf('day');
  const dateStart = date.startOf('day');

  if (dateStart.isSame(tomorrow, 'day')) {
    return `내일 ${date.format('HH시')} 마감`;
  }
  return `${date.diff(now, 'day')}일 후 마감`;
};

export const isClosed = (isoString?: string): boolean => {
  if (!isoString) return false;
  const date = dayjs.utc(isoString).tz('Asia/Seoul');
  const now = dayjs().tz('Asia/Seoul');
  return date.isBefore(now);
};

export const formatReviewDate = (isoString: string) => {
  return dayjs.utc(isoString).tz('Asia/Seoul').format('YYYY.MM.DD');
};

// UTC -> KST
export const toUTCFromKST = (val: string | Date) => {
  const src = typeof val === 'string' ? val : formatDateToLocalISO(val);
  // Interpret the input as Asia/Seoul local time, then convert to UTC
  return dayjs.tz(src, 'Asia/Seoul').utc().format('YYYY-MM-DDTHH:mm:ss[Z]');
};
