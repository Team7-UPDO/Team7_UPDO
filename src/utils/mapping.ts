import { tags, locations, TAG_OPTIONS, SORT_OPTIONS } from '@/constants/tags';
import { tabs, types, TAB_OPTIONS } from '@/constants/tabs';
import { formatDate, formatDateToLocalISO, formatDeadline, formatTime } from './date';
import { IGathering } from '@/types/gatherings';

export type FilterState = {
  main: '성장' | '네트워킹';
  subType?: string;
  location?: string;
  date?: string;
  sortBy?: 'dateTime' | 'registrationEnd' | 'participantCount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
};
export type Tag = (typeof tags)[number];
export type Location = (typeof locations)[number];
export type Tab = (typeof tabs)[number];
export type Type = (typeof types)[number];

// 1. Tag <-> Location
export function TagToLocation(tag: Tag): Location {
  const tagToLocationMap = Object.fromEntries(
    TAG_OPTIONS.filter(o => o.value !== 'default').map(o => [o.value, o.location]),
  ) as Record<Tag, Location>;

  return tagToLocationMap[tag];
}

export function LocationToTag(location: Location): Tag {
  const locationToTagMap = Object.fromEntries(
    TAG_OPTIONS.filter(o => o.value !== 'default').map(o => [o.location, o.value]),
  ) as Record<Location, Tag>;

  return locationToTagMap[location];
}

// 1-1. tag 영어 <-> tag 한글
export function tagEngToKr(value: string): string {
  return TAG_OPTIONS.find(o => o.value === value)?.label ?? value;
}

export function tagKrToEng(label: string): string {
  return TAG_OPTIONS.find(o => o.label === label)?.value ?? label;
}

// 2. Tab <-> Type
export function TabToType(tab: Tab): Type {
  const tabToTypeMap = Object.fromEntries(TAB_OPTIONS.map(o => [o.value, o.type])) as Record<
    Tab,
    Type
  >;

  return tabToTypeMap[tab];
}

export function TypeToTab(type: Type): Tab {
  const typeToTabMap = Object.fromEntries(TAB_OPTIONS.map(o => [o.type, o.value])) as Record<
    Type,
    Tab
  >;

  return typeToTabMap[type];
}

export const tagLabelToLocation = (label: string) =>
  TAG_OPTIONS.find(t => t.label === label)?.location;

export const sortLabelToParams = (
  label: string,
): { sortBy?: 'dateTime' | 'registrationEnd' | 'participantCount'; sortOrder?: 'asc' | 'desc' } => {
  const found = SORT_OPTIONS.find(o => o.label === label);
  if (!found) return {};
  switch (found.value) {
    case 'participantCount':
      return { sortBy: 'participantCount', sortOrder: 'desc' };
    case 'registrationEnd':
      return { sortBy: 'registrationEnd', sortOrder: 'asc' };
    default:
      return {};
  }
};

export function buildFilters({
  activeMain,
  activeSubType,
  selectedTag,
  selectedDate,
  selectedFilter,
  limit = 10,
}: {
  activeMain: '성장' | '네트워킹';
  activeSubType?: string;
  selectedTag: string;
  selectedDate?: Date;
  selectedFilter: string;
  limit?: number;
}): FilterState {
  const location = selectedTag === '태그 전체' ? undefined : tagLabelToLocation(selectedTag);
  const { sortBy, sortOrder } = sortLabelToParams(selectedFilter);
  let subType: string | undefined = activeSubType;
  if (activeMain === '네트워킹') {
    subType = 'WORKATION';
  }
  return {
    main: activeMain,
    subType,
    location,
    date: selectedDate ? formatDateToLocalISO(selectedDate).slice(0, 10) : undefined,
    sortBy,
    sortOrder,
    limit,
  };
}

export function buildReviewFilters({
  activeMain,
  activeSubType,
  selectedTag,
  selectedDate,
  selectedFilter,
}: {
  activeMain: '성장' | '네트워킹';
  activeSubType?: string;
  selectedTag: string;
  selectedDate?: Date;
  selectedFilter: string;
}): Record<string, string> {
  const filters: Record<string, string> = {};

  if (activeSubType) {
    filters.type = activeSubType;
  } else if (activeMain === '네트워킹') {
    filters.type = 'WORKATION';
  }

  const location = selectedTag === '태그 전체' ? undefined : tagLabelToLocation(selectedTag);
  if (location) {
    filters.location = location;
  }

  if (selectedDate) {
    filters.date = formatDateToLocalISO(selectedDate).slice(0, 10);
  }

  const { sortBy, sortOrder } = sortLabelToParams(selectedFilter);
  if (sortBy) {
    filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder;
  }

  return filters;
}

export function toGetGatheringsParams(
  filters: FilterState,
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries({
      type: filters.subType,
      location: filters.location,
      date: filters.date,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit: filters.limit,
    }).filter(([, value]) => value !== undefined && value !== null),
  ) as Record<string, string | number | boolean>;
}

// IGathering → UI 변환 유틸
export const mapGatheringToUI = (data: IGathering, userId: number | null) => ({
  id: data.id,
  name: data.name,
  dateText: formatDate(data.dateTime),
  timeText: formatTime(data.dateTime),
  deadlineText: formatDeadline(data.registrationEnd ?? data.dateTime),
  registrationEnd: data.registrationEnd,
  isHost: userId ? data.createdBy === userId : false,
  participantCount: data.participantCount,
  capacity: data.capacity,
  minParticipants: 5,
  image: data.image || '/images/find_banner.png',
  location: data.location,
  type: data.type,
});
