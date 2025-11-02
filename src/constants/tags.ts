export const tags = ['growth', 'learn', 'challenge', 'connect'];
export const locations = ['건대입구', '신림', '을지로3가', '홍대입구'];

export type Option = { label: string; value: string; location: string };

export const TAG_OPTIONS: Readonly<Option[]> = [
  { label: '태그 전체', value: 'default', location: '' },
  { label: '성장', value: 'growth', location: '건대입구' },
  { label: '배움', value: 'learn', location: '을지로3가' },
  { label: '도전', value: 'challenge', location: '신림' },
  { label: '연결', value: 'connect', location: '홍대입구' },
] as const;

export type SortOption = {
  label: string;
  value:
    | 'ascRegistrationEnd'
    | 'descRegistrationEnd'
    | 'ascParticipantCount'
    | 'descParticipantCount'
    | 'ascDateTime'
    | 'descDateTime';
};

export type reviewSortOption = {
  label: string;
  value:
    | 'ascParticipantCount'
    | 'descParticipantCount'
    | 'ascCreatedAt'
    | 'descCreatedAt'
    | 'ascScore'
    | 'descScore';
};
export const SORT_OPTIONS: Readonly<SortOption[]> = [
  { label: '마감 여유순', value: 'descRegistrationEnd' },
  { label: '마감 임박순', value: 'ascRegistrationEnd' },
  { label: '모임 임박순', value: 'ascDateTime' },
  { label: '모임 늦은순', value: 'descDateTime' },
  { label: '참여자 적은순', value: 'ascParticipantCount' },
  { label: '참여자 많은순', value: 'descParticipantCount' },
] as const;

export const REVIEW_SORT_OPTIONS: Readonly<reviewSortOption[]> = [
  { label: '최신 등록순', value: 'ascCreatedAt' },
  { label: '오래된 등록순', value: 'descCreatedAt' },
  { label: '높은 평점순', value: 'descScore' },
  { label: '낮은 평점순', value: 'ascScore' },
  { label: '참여자 많은순', value: 'descParticipantCount' },
  { label: '참여자 적은순', value: 'ascParticipantCount' },
] as const;
