'use client';

import { Select } from '@/components/ui';
import { SUPPORTED_LANGUAGES, CODE_SOURCES } from '@/types';

interface FeedFiltersProps {
  language: string;
  source: string;
  onLanguageChange: (value: string) => void;
  onSourceChange: (value: string) => void;
}

export default function FeedFilters({
  language,
  source,
  onLanguageChange,
  onSourceChange,
}: FeedFiltersProps) {
  const languageOptions = [
    { value: '', label: 'All Languages' },
    ...SUPPORTED_LANGUAGES.map((l) => ({ value: l.value, label: l.label })),
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    ...CODE_SOURCES.map((s) => ({ value: s.value, label: s.label })),
  ];

  return (
    <div
      className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg"
      role="search"
      aria-label="Filter posts"
    >
      <div className="flex-1 max-w-xs">
        <Select
          label="Filter by language"
          hideLabel
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          options={languageOptions}
        />
      </div>
      <div className="flex-1 max-w-xs">
        <Select
          label="Filter by source"
          hideLabel
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          options={sourceOptions}
        />
      </div>
    </div>
  );
}
