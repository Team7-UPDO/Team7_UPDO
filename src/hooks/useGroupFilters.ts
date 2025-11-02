'use client';

import { useState, useRef } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { REVIEW_SORT_OPTIONS, SORT_OPTIONS, TAG_OPTIONS } from '@/constants';
import { buildFilters, buildReviewFilters, type FilterState } from '@/utils/mapping';

type FilterMode = 'gathering' | 'review';

type BaseReturn = {
  activeMain: '성장' | '네트워킹';
  activeSubId: string | undefined;
  activeSubType: string | undefined;
  isTagOpen: boolean;
  isFilterOpen: boolean;
  isCalendarOpen: boolean;
  selectedTag: string;
  selectedFilter: string;
  selectedReviewFilter: string;
  selectedDate: Date | undefined;
  tagRef: React.RefObject<HTMLDivElement>;
  filterRef: React.RefObject<HTMLDivElement>;
  calendarRef: React.RefObject<HTMLDivElement>;
  setIsTagOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleTagSelect: (value: string) => void;
  handleFilterSelect: (value: string) => void;
  handleReviewFilterSelect: (value: string) => void;
  handleDateConfirm: (date?: Date) => void;
  handleCategoryChange: (id: string, apiType: string) => void;
  handleMainChange: (value: '성장' | '네트워킹') => void;
};

export function useGroupFilters(mode: 'review'): BaseReturn & { params: Record<string, string> };
export function useGroupFilters(mode?: 'gathering'): BaseReturn & { filters: FilterState };
export function useGroupFilters(mode: FilterMode = 'gathering') {
  const [activeMain, setActiveMain] = useState<'성장' | '네트워킹'>('성장');
  const [activeSubId, setActiveSubId] = useState<string | undefined>(undefined);
  const [activeSubType, setActiveSubType] = useState<string | undefined>(undefined);

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('태그 전체');
  const [selectedFilter, setSelectedFilter] = useState('마감 여유순');
  const [selectedReviewFilter, setReviewSelectedFilter] = useState('최신 등록순');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const tagRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useOutsideClick(tagRef, () => setIsTagOpen(false));
  useOutsideClick(filterRef, () => setIsFilterOpen(false));
  useOutsideClick(calendarRef, () => setIsCalendarOpen(false));

  const handleTagSelect = (value: string) => {
    const selected = TAG_OPTIONS.find(tag => tag.value === value);
    setSelectedTag(selected?.label ?? '태그 전체');
    setIsTagOpen(false);
  };

  const handleFilterSelect = (value: string) => {
    const selected = SORT_OPTIONS.find(opt => opt.value === value);
    setSelectedFilter(selected?.label ?? value);
    setIsFilterOpen(false);
  };
  const handleReviewFilterSelect = (value: string) => {
    const reviewSelected = REVIEW_SORT_OPTIONS.find(opt => opt.value === value);
    setReviewSelectedFilter(reviewSelected?.label ?? value);
    setIsFilterOpen(false);
  };
  const handleDateConfirm = (date?: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleCategoryChange = (id: string, apiType: string) => {
    setActiveSubId(id);
    setActiveSubType(apiType);
  };

  const handleMainChange = (value: '성장' | '네트워킹') => {
    setActiveMain(value);
    setActiveSubId(undefined);
    setActiveSubType(undefined);
  };

  const result =
    mode === 'review'
      ? buildReviewFilters({
          activeMain,
          activeSubType,
          selectedTag,
          selectedDate,
          selectedReviewFilter,
        })
      : buildFilters({
          activeMain,
          activeSubType,
          selectedTag,
          selectedDate,
          selectedFilter,
        });

  return {
    activeMain,
    activeSubId,
    activeSubType,
    isTagOpen,
    isFilterOpen,
    isCalendarOpen,
    selectedTag,
    selectedFilter,
    selectedReviewFilter,
    selectedDate,

    tagRef,
    filterRef,
    calendarRef,

    setIsTagOpen,
    setIsFilterOpen,
    setIsCalendarOpen,
    setSelectedDate,
    handleTagSelect,
    handleFilterSelect,
    handleReviewFilterSelect,
    handleDateConfirm,
    handleCategoryChange,
    handleMainChange,

    ...(mode === 'review' ? { params: result } : { filters: result }),
  };
}
