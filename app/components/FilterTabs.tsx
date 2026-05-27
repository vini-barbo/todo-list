'use client';

export type FilterType = 'all' | 'pending' | 'completed';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export default function FilterTabs({
  activeFilter,
  onFilterChange,
  counts,
}: FilterTabsProps) {
  const tabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key)}
          className={`
            px-4 py-3 text-sm font-medium transition-colors relative
            ${
              activeFilter === tab.key
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          {tab.label}
          <span className="ml-1.5 text-xs text-gray-500">({tab.count})</span>
          {activeFilter === tab.key && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      ))}
    </div>
  );
}
