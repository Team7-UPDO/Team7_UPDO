'use client';

import { useState, useRef } from 'react';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { SORT_OPTIONS, TAG_OPTIONS } from '@/constants';
import { buildReviewFilters } from '@/utils/mapping';

export function useReviewFilters() {
  const [activeMain, setActiveMain] = useState<'성장' | '네트워킹'>('성장');
  const [activeSubId, setActiveSubId] = useState<string | undefined>(undefined);
  const [activeSubType, setActiveSubType] = useState<string | undefined>(undefined);

  const [isTagOpen, setIsTagOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState('태그 전체');
  const [selectedFilter, setSelectedFilter] = useState('참여 인원순');
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

  const queryParams = buildReviewFilters({
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
    handleDateConfirm,
    handleCategoryChange,
    handleMainChange,
    queryParams,
  };
}
