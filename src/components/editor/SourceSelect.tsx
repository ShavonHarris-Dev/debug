'use client';

import { Select } from '@/components/ui';
import { CODE_SOURCES, CodeSource } from '@/types';

interface SourceSelectProps {
  value: CodeSource;
  onChange: (value: CodeSource) => void;
  disabled?: boolean;
}

export default function SourceSelect({
  value,
  onChange,
  disabled = false,
}: SourceSelectProps) {
  return (
    <Select
      label="Code Source"
      value={value}
      onChange={(e) => onChange(e.target.value as CodeSource)}
      disabled={disabled}
      options={CODE_SOURCES.map((source) => ({
        value: source.value,
        label: `${source.label} - ${source.description}`,
      }))}
    />
  );
}
