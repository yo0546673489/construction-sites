// components/shared/date-range-picker.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentRange: number;
}

const ranges = [
  { days: 7, label: '7 ימים' },
  { days: 30, label: '30 ימים' },
  { days: 90, label: '90 ימים' },
];

export function DateRangePicker({ currentRange }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (days: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('range', days.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1">
      {ranges.map((range) => {
        const isActive = currentRange === range.days;
        return (
          <button
            key={range.days}
            onClick={() => handleChange(range.days)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
