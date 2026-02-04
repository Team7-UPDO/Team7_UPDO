import {
  buildFilters,
  buildReviewFilters,
  sortLabelToParams,
  sortReviewLabelToParams,
  mapGatheringToUI,
  toGetGatheringsParams,
  LocationToTag,
  TagToLocation,
} from '@/utils/mapping';
import { createGathering } from './factories/gathering';

// buildFilters
describe('buildFilters', () => {
  const defaultArgs = {
    activeMain: '성장' as const,
    selectedTag: '태그 전체',
    selectedFilter: '마감 여유순',
  };

  it('네트워킹이면 subType이 WORKATION으로 강제된다', () => {
    const result = buildFilters({
      ...defaultArgs,
      activeMain: '네트워킹',
      activeSubType: 'DALLAEMFIT',
    });
    expect(result.subType).toBe('WORKATION');
  });

  it('성장이면 activeSubType이 그대로 유지된다', () => {
    const result = buildFilters({
      ...defaultArgs,
      activeMain: '성장',
      activeSubType: 'OFFICE_STRETCHING',
    });
    expect(result.subType).toBe('OFFICE_STRETCHING');
  });

  it('태그 전체이면 location이 undefined이다', () => {
    const result = buildFilters(defaultArgs);
    expect(result.location).toBeUndefined();
  });

  it('특정 태그를 선택하면 해당 location이 설정된다', () => {
    const result = buildFilters({
      ...defaultArgs,
      selectedTag: '성장',
    });
    expect(result.location).toBe('건대입구');
  });

  it('날짜가 있으면 YYYY-MM-DD 포맷으로 변환된다', () => {
    const result = buildFilters({
      ...defaultArgs,
      selectedDate: new Date(2025, 5, 15),
    });
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('날짜가 없으면 date가 undefined이다', () => {
    const result = buildFilters(defaultArgs);
    expect(result.date).toBeUndefined();
  });

  it('기본 limit은 10이다', () => {
    const result = buildFilters(defaultArgs);
    expect(result.limit).toBe(10);
  });
});

// ─────────────────────────────────────────────────
// buildReviewFilters
// ─────────────────────────────────────────────────
describe('buildReviewFilters', () => {
  const defaultArgs = {
    activeMain: '성장' as const,
    selectedTag: '태그 전체',
    selectedReviewFilter: '최신 등록순',
  };

  it('성장 + subType 없으면 type이 DALLAEMFIT 기본값이다', () => {
    const result = buildReviewFilters(defaultArgs);
    expect(result.type).toBe('DALLAEMFIT');
  });

  it('성장 + subType 있으면 해당 type이 설정된다', () => {
    const result = buildReviewFilters({
      ...defaultArgs,
      activeSubType: 'MINDFULNESS',
    });
    expect(result.type).toBe('MINDFULNESS');
  });

  it('네트워킹이면 type이 WORKATION이다', () => {
    const result = buildReviewFilters({
      ...defaultArgs,
      activeMain: '네트워킹',
    });
    expect(result.type).toBe('WORKATION');
  });

  it('태그 전체이면 location이 없다', () => {
    const result = buildReviewFilters(defaultArgs);
    expect(result.location).toBeUndefined();
  });

  it('특정 태그 선택 시 location이 설정된다', () => {
    const result = buildReviewFilters({
      ...defaultArgs,
      selectedTag: '도전',
    });
    expect(result.location).toBe('신림');
  });
});

// sortLabelToParams
describe('sortLabelToParams', () => {
  it('마감 여유순 → registrationEnd desc', () => {
    expect(sortLabelToParams('마감 여유순')).toEqual({
      sortBy: 'registrationEnd',
      sortOrder: 'desc',
    });
  });

  it('마감 임박순 → registrationEnd asc', () => {
    expect(sortLabelToParams('마감 임박순')).toEqual({
      sortBy: 'registrationEnd',
      sortOrder: 'asc',
    });
  });

  it('모임 임박순 → dateTime asc', () => {
    expect(sortLabelToParams('모임 임박순')).toEqual({
      sortBy: 'dateTime',
      sortOrder: 'asc',
    });
  });

  it('존재하지 않는 label이면 빈 객체를 반환한다', () => {
    expect(sortLabelToParams('없는 옵션')).toEqual({});
  });
});

// sortReviewLabelToParams
describe('sortReviewLabelToParams', () => {
  it('최신 등록순 → createdAt asc', () => {
    expect(sortReviewLabelToParams('최신 등록순')).toEqual({
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
  });

  it('높은 평점순 → score desc', () => {
    expect(sortReviewLabelToParams('높은 평점순')).toEqual({
      sortBy: 'score',
      sortOrder: 'desc',
    });
  });

  it('존재하지 않는 label이면 빈 객체를 반환한다', () => {
    expect(sortReviewLabelToParams('없는 옵션')).toEqual({});
  });
});

// mapGatheringToUI
describe('mapGatheringToUI', () => {
  it('userId와 createdBy가 같으면 isHost가 true이다', () => {
    const gathering = createGathering({ createdBy: 10 });
    const result = mapGatheringToUI(gathering, 10);
    expect(result.isHost).toBe(true);
  });

  it('userId와 createdBy가 다르면 isHost가 false이다', () => {
    const gathering = createGathering({ createdBy: 10 });
    const result = mapGatheringToUI(gathering, 99);
    expect(result.isHost).toBe(false);
  });

  it('userId가 null이면 isHost가 false이다', () => {
    const gathering = createGathering();
    const result = mapGatheringToUI(gathering, null);
    expect(result.isHost).toBe(false);
  });

  it('image가 없으면 fallback 이미지를 사용한다', () => {
    const gathering = createGathering({ image: undefined });
    const result = mapGatheringToUI(gathering, null);
    expect(result.image).toBe('/images/detail_empty.webp');
  });

  it('image가 있으면 해당 이미지를 사용한다', () => {
    const gathering = createGathering({ image: '/custom.jpg' });
    const result = mapGatheringToUI(gathering, null);
    expect(result.image).toBe('/custom.jpg');
  });
});

// toGetGatheringsParams
describe('toGetGatheringsParams', () => {
  it('undefined 값은 결과에서 제거된다', () => {
    const result = toGetGatheringsParams({
      main: '성장',
      subType: 'DALLAEMFIT',
      location: undefined,
      date: undefined,
      sortBy: 'dateTime',
      sortOrder: 'asc',
    });
    expect(result).toEqual({
      type: 'DALLAEMFIT',
      sortBy: 'dateTime',
      sortOrder: 'asc',
    });
    expect(result).not.toHaveProperty('location');
    expect(result).not.toHaveProperty('date');
  });
});

// LocationToTag / TagToLocation
describe('LocationToTag / TagToLocation', () => {
  it('건대입구 → growth', () => {
    expect(LocationToTag('건대입구')).toBe('growth');
  });

  it('growth → 건대입구', () => {
    expect(TagToLocation('growth')).toBe('건대입구');
  });

  it('홍대입구 → connect', () => {
    expect(LocationToTag('홍대입구')).toBe('connect');
  });
});
