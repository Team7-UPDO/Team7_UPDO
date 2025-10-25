import Dropdown from '@/components/ui/Dropdown';
import { Calendar } from '@/components/ui/Calendar';
import { SORT_OPTIONS, TAG_OPTIONS } from '@/constants';
import IconText from '@/components/ui/IconText';
import Category from '@/components/ui/Category';

type GroupFiltersProps = {
  isTagOpen: boolean;
  isFilterOpen: boolean;
  isCalendarOpen: boolean;
  selectedTag: string;
  selectedFilter: string;
  selectedDate?: Date;
  tagRef: React.RefObject<HTMLDivElement>;
  filterRef: React.RefObject<HTMLDivElement>;
  calendarRef: React.RefObject<HTMLDivElement>;
  setIsTagOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDate: (date?: Date) => void;
  handleTagSelect: (value: string) => void;
  handleFilterSelect: (value: string) => void;
  handleDateConfirm: (date?: Date) => void;
  activeSubId?: string;
  activeSubType?: string;
  handleCategoryChange: (id: string, type: string) => void;
};

export default function GroupFilters({
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
  activeSubId,
  activeSubType,

  handleCategoryChange,
}: GroupFiltersProps) {
  return (
    <div className="mt-4 mb-4 flex flex-col gap-1.5 sm:mt-8 sm:flex-row sm:items-center">
      <div>
        <Category
          mainCategory="성장"
          activeId={activeSubId}
          activeType={activeSubType}
          onChange={handleCategoryChange}
        />
      </div>
      <div className="flex items-center font-medium text-gray-500 sm:ml-auto sm:h-[40px]">
        <div ref={tagRef} className="relative">
          <IconText
            icon="arrow"
            iconPosition="trailing"
            className="cursor-pointer px-2 hover:text-gray-800"
            onClick={() => setIsTagOpen(prev => !prev)}>
            {selectedTag}
          </IconText>
          {isTagOpen && (
            <div className="absolute z-10 mt-2 sm:top-full sm:right-0">
              <Dropdown
                items={TAG_OPTIONS}
                onChange={handleTagSelect}
                onOpenChange={setIsTagOpen}
                size="small"
              />
            </div>
          )}
        </div>

        <div ref={calendarRef} className="relative">
          <IconText
            icon="arrow"
            iconPosition="trailing"
            className="cursor-pointer px-2 hover:text-gray-800"
            onClick={() => setIsCalendarOpen(prev => !prev)}>
            {selectedDate
              ? selectedDate.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
              : '날짜 전체'}
          </IconText>

          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 sm:top-full sm:right-0">
              <Calendar
                cancelLabel="초기화"
                value={selectedDate}
                onCancel={() => {
                  setSelectedDate(undefined);
                  setIsCalendarOpen(false);
                }}
                onConfirm={handleDateConfirm}
              />
            </div>
          )}
        </div>

        <div ref={filterRef} className="relative">
          <IconText
            icon="filter"
            iconColor="var(--color-gray-800)"
            className="cursor-pointer px-2 hover:text-gray-800"
            onClick={() => setIsFilterOpen(prev => !prev)}>
            {selectedFilter}
          </IconText>

          {isFilterOpen && (
            <div className="absolute top-full right-0 z-10 mt-2">
              <Dropdown
                items={SORT_OPTIONS}
                onChange={handleFilterSelect}
                onOpenChange={setIsFilterOpen}
                size="small"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
