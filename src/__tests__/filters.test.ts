import { normalizeFilters, getCleanFilters } from '@/utils/filters';

// normalizeFilters
describe('normalizeFilters', () => {
  it('빈 객체를 전달하면 기본값이 설정된다', () => {
    const result = normalizeFilters({});
    expect(result.main).toBe('성장');
    expect(result.sortBy).toBe('registrationEnd');
    expect(result.sortOrder).toBe('desc');
    expect(result.limit).toBe(10);
  });

  it('subType이 전체이면 undefined로 변환된다', () => {
    const result = normalizeFilters({ subType: '전체' });
    expect(result.subType).toBeUndefined();
  });

  it('subType이 전체가 아니면 그대로 유지된다', () => {
    const result = normalizeFilters({ subType: 'DALLAEMFIT' });
    expect(result.subType).toBe('DALLAEMFIT');
  });

  it('명시적으로 전달한 값은 기본값을 덮어쓴다', () => {
    const result = normalizeFilters({
      main: '네트워킹',
      sortBy: 'dateTime',
      sortOrder: 'asc',
      limit: 20,
    });
    expect(result.main).toBe('네트워킹');
    expect(result.sortBy).toBe('dateTime');
    expect(result.sortOrder).toBe('asc');
    expect(result.limit).toBe(20);
  });
});

// getCleanFilters
describe('getCleanFilters', () => {
  it('undefined 값을 가진 키가 제거된다', () => {
    const result = getCleanFilters({ main: '성장' });
    const keys = Object.keys(result);
    expect(keys).not.toContain('subType');
    expect(keys).not.toContain('location');
    expect(keys).not.toContain('date');
  });

  it('값이 있는 키는 유지된다', () => {
    const result = getCleanFilters({
      main: '성장',
      sortBy: 'registrationEnd',
    });
    expect(result.main).toBe('성장');
    expect(result.sortBy).toBe('registrationEnd');
  });
});
