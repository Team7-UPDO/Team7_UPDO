'use client';
import React from 'react';
import { DayPicker, type NavProps } from 'react-day-picker';
import { Button } from './Button';

export interface CalendarProps {
  value?: Date; // 선택된 날짜 or 날짜/시간
  cancelLabel?: string; // 취소 대신 사용할 문자열
  onConfirm: (date?: Date) => void; // "확인" 버튼 클릭 시 최종 값 전달
  onNext?: (date?: Date) => void; // "다음" 클릭 시 날짜만 전달
  onCancel: () => void; // "취소" 버튼 클릭 핸들러
  startMonth?: Date; // 달력이 시작되는 월 (기본값: 2025-01-01)
  className?: string; // 추가 CSS 클래스
  variant?: 'date' | 'datetime'; // 달력 모드, 또는 날짜+시간 선택모드
  blockPast?: boolean; // 오늘 이전 날짜/월 선택 불가 (선택/네비게이션 모두 제한)
}

function mergeDateTime(date: Date | undefined, h: number, m: number) {
  if (!date) return undefined;
  const d = new Date(date);
  d.setHours(h);
  d.setMinutes(m);
  d.setSeconds(0);
  d.setMilliseconds(0);
  return d;
}

function CustomNav({ onPreviousClick, onNextClick, previousMonth, nextMonth }: NavProps) {
  const currentMonth = previousMonth
    ? new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1)
    : nextMonth
      ? new Date(nextMonth.getFullYear(), nextMonth.getMonth() - 1, 1)
      : undefined;
  return (
    <div className="mb-2 flex w-full items-center justify-between">
      <button
        type="button"
        onClick={onPreviousClick}
        disabled={!previousMonth}
        aria-label="Go to previous month"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-purple-500 transition-colors">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M11 14 5 8l6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>
      <div className="flex-1 text-center text-xl font-bold text-gray-900">
        {currentMonth?.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      <button
        type="button"
        onClick={onNextClick}
        disabled={!nextMonth}
        aria-label="Go to next month"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-purple-500 transition-colors">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M5 14l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export const Calendar = ({
  value,
  cancelLabel,
  onCancel,
  onConfirm,
  onNext,
  startMonth = new Date('2025-01-01'),
  variant = 'date',
  blockPast = false,
}: CalendarProps) => {
  const [step, setStep] = React.useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value);
  const timeStep = 5;

  const now = new Date();
  let roundedHour = now.getHours();
  let roundedMinute = Math.ceil(now.getMinutes() / timeStep) * timeStep;
  if (roundedMinute === 60) {
    roundedMinute = 0;
    roundedHour = (roundedHour + 1) % 24;
  }
  const initialH = value ? value.getHours() : roundedHour;
  const initialM = value ? value.getMinutes() : roundedMinute;

  const [hour, setHour] = React.useState<number>(initialH);
  const [minute, setMinute] = React.useState<number>(initialM);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const currentMonthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  const effectiveStartMonth = blockPast
    ? startMonth > currentMonthStart
      ? startMonth
      : currentMonthStart
    : startMonth;

  React.useEffect(() => {
    const base = tempDate ?? value;
    if (!base) return;
    setHour(base.getHours());
    setMinute(base.getMinutes() - (base.getMinutes() % timeStep));
  }, [tempDate, value, timeStep]);

  const isPM = hour >= 12;

  const hours = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
  }, []);

  const minutes = React.useMemo(() => {
    const cnt = Math.floor(60 / timeStep);
    return Array.from({ length: cnt }, (_, i) => i * timeStep);
  }, [timeStep]);

  const handleSelect = (d?: Date) => {
    setTempDate(d);
  };

  const FooterBar = ({
    cancelLabel,
    primaryLabel,
    onPrimary,
    onCancel,
    disabledPrimary,
  }: {
    primaryLabel: string;
    cancelLabel?: string;
    onPrimary: () => void;
    onCancel?: () => void;
    disabledPrimary: boolean;
  }) => {
    const buttonClassName = 'h-[48px] typo-body-bold rounded-md';
    return (
      <div className="flex w-full items-center justify-center gap-[6px] px-0">
        <div className="h-full w-full">
          <Button
            variant={'calendarOutline'}
            size="responsive_full"
            className={`${buttonClassName} shrink-0`}
            onClick={onCancel}>
            {cancelLabel || '취소'}
          </Button>
        </div>
        <div className="h-full w-full">
          <Button
            variant={'calendarSolid'}
            size="responsive_full"
            disabled={disabledPrimary}
            className={`${buttonClassName} shrink-0`}
            onClick={onPrimary}>
            {primaryLabel}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-md border-[1px] border-gray-200 bg-white">
      {step === 'date' && (
        <DayPicker
          mode="single"
          showOutsideDays
          selected={tempDate ?? value}
          onSelect={handleSelect}
          disabled={blockPast ? { before: todayStart } : undefined}
          startMonth={effectiveStartMonth}
          formatters={{
            formatWeekdayName: day => day?.toLocaleDateString('en-US', { weekday: 'short' }),
          }}
          components={{ Nav: CustomNav }}
          classNames={{
            root: 'text-gray-800 flex flex-col box-border px-6 py-3',
            nav: 'w-full',
            month_caption: 'hidden',
            caption_label: 'hidden',
            month_grid: 'flex w-full flex-col',
            weekdays: 'flex w-full mb-2',
            weekday: 'flex-1 text-center label p-1',
            week: 'flex w-full h-8',
            day: 'flex-1 flex justify-center items-center',
            day_button:
              'w-full h-full p-0 typo-body-sm cursor-pointer rounded-md transition-colors hover:bg-purple-500 hover:text-white aria-selected:hover:bg-purple-500 flex items-center justify-center ',
            today: 'text-purple-500',
            disabled: 'text-gray-300 opacity-50 cursor-not-allowed',
            button_previous:
              'h-10 w-10 cursor-pointer inline-flex items-center justify-center rounded-md text-purple-500 transition-colors',
            button_next:
              'h-10 w-10 inline-flex cursor-pointer items-center justify-center rounded-md text-purple-500 transition-colors',
            chevron: 'fill-current w-4 h-4',
            footer: 'pt-1 mt-3',
          }}
          modifiersClassNames={{
            selected: 'bg-purple-500 text-white rounded-md',
            outside: 'text-gray-400',
          }}
          footer={
            variant === 'date' ? (
              <FooterBar
                cancelLabel={cancelLabel}
                primaryLabel="확인"
                onPrimary={() => onConfirm(tempDate ?? value)}
                onCancel={onCancel}
                disabledPrimary={!tempDate}
              />
            ) : (
              <FooterBar
                cancelLabel={cancelLabel}
                primaryLabel="다음"
                onPrimary={() => {
                  if (tempDate) onNext?.(tempDate);
                  setStep('time');
                }}
                onCancel={onCancel}
                disabledPrimary={!tempDate}
              />
            )
          }
        />
      )}

      {step === 'time' && (
        <div className="flex flex-col px-6 py-5">
          <div className="flex items-center justify-center gap-[10px] pb-3 text-gray-800">
            {/* Hours */}
            <div className="w-16">
              <div className="h-64 overflow-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {hours.map(h => (
                  <button
                    key={h}
                    type="button"
                    className={
                      'block w-full rounded-md py-2 text-center ' +
                      ((hour % 12 || 12) === h ? 'bg-purple-500 text-white' : 'hover:bg-gray-100')
                    }
                    onClick={() => {
                      const base = isPM ? 12 : 0;
                      setHour(((h % 12) + base) % 24);
                    }}>
                    {h.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="w-16">
              <div className="h-64 overflow-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {minutes.map(m => (
                  <button
                    key={m}
                    type="button"
                    className={
                      'block w-full rounded-md py-2 text-center ' +
                      (minute === m ? 'bg-purple-500 text-white' : 'hover:bg-gray-100')
                    }
                    onClick={() => {
                      setMinute(m);
                    }}>
                    {m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="w-16">
              <div className="h-64 overflow-auto pr-1">
                {['AM', 'PM'].map(label => (
                  <button
                    key={label}
                    type="button"
                    className={
                      'block w-full rounded-md py-2 text-center ' +
                      ((label === 'PM') === isPM ? 'bg-purple-500 text-white' : 'hover:bg-gray-100')
                    }
                    onClick={() => {
                      const wantPM = label === 'PM';
                      const base = (hour % 12) + (wantPM ? 12 : 0);
                      setHour(base);
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <FooterBar
            cancelLabel={cancelLabel}
            primaryLabel="확인"
            onPrimary={() => {
              const baseDate = tempDate ?? value;
              const H = (hour % 12) + (isPM ? 12 : 0);
              onConfirm(baseDate ? mergeDateTime(baseDate, H, minute) : undefined);
            }}
            onCancel={() => {
              setStep('date');
            }}
            disabledPrimary={!tempDate}
          />
        </div>
      )}
    </div>
  );
};
