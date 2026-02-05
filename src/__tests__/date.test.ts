import {
  formatDate,
  formatDateToLocalISO,
  formatDeadline,
  formatTime,
  isClosed,
} from '@/utils/date';

// 현재 시간을 고정해서 결정적 테스트를 보장
beforeEach(() => {
  // 2025-06-15 12:00:00 KST (UTC+9) = 2025-06-15 03:00:00 UTC
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2025-06-15T03:00:00Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

// formatDeadline
describe('formatDeadline', () => {
  it('이미 지난 날짜는 마감을 반환한다', () => {
    expect(formatDeadline('2025-06-14T00:00:00Z')).toBe('마감');
  });

  it('오늘 마감이면 오늘 HH시 마감을 반환한다', () => {
    // 2025-06-15 18:00:00 KST = 2025-06-15 09:00:00 UTC (오늘 KST 기준)
    const result = formatDeadline('2025-06-15T09:00:00Z');
    expect(result).toBe('오늘 18시 마감');
  });

  it('내일 마감이면 내일 HH시 마감을 반환한다', () => {
    // 2025-06-16 15:00:00 KST = 2025-06-16 06:00:00 UTC
    const result = formatDeadline('2025-06-16T06:00:00Z');
    expect(result).toBe('내일 15시 마감');
  });

  it('3일 후 마감이면 N일 후 마감을 반환한다', () => {
    // 2025-06-18 09:00:00 UTC = 2025-06-18 18:00:00 KST (3일 후)
    const result = formatDeadline('2025-06-18T09:00:00Z');
    expect(result).toMatch(/\d+일 후 마감/);
  });
});

// isClosed
describe('isClosed', () => {
  it('지난 날짜이면 true를 반환한다', () => {
    expect(isClosed('2020-01-01T00:00:00Z')).toBe(true);
  });

  it('미래 날짜이면 false를 반환한다', () => {
    expect(isClosed('2099-12-01T00:00:00Z')).toBe(false);
  });

  it('undefined이면 false를 반환한다', () => {
    expect(isClosed(undefined)).toBe(false);
  });
});

// formatDateToLocalISO
describe('formatDateToLocalISO', () => {
  it('Date 객체를 ISO 문자열로 변환한다', () => {
    const date = new Date(2025, 5, 15, 14, 30, 0); // 2025-06-15 14:30:00 로컬
    const result = formatDateToLocalISO(date);
    expect(result).toBe('2025-06-15T14:30:00');
  });

  it('한 자리 월/일을 0으로 패딩한다', () => {
    const date = new Date(2025, 0, 5, 9, 5, 3); // 2025-01-05 09:05:03
    const result = formatDateToLocalISO(date);
    expect(result).toBe('2025-01-05T09:05:03');
  });
});

// formatDate / formatTime
describe('formatDate', () => {
  it('ISO 문자열을 M월 D일 형식으로 변환한다', () => {
    // UTC 기준 6월 15일 03:00 → KST 6월 15일 12:00
    expect(formatDate('2025-06-15T03:00:00Z')).toBe('6월 15일');
  });
});

describe('formatTime', () => {
  it('ISO 문자열을 HH:mm 형식으로 변환한다', () => {
    // UTC 03:00 → KST 12:00
    expect(formatTime('2025-06-15T03:00:00Z')).toBe('12:00');
  });
});
