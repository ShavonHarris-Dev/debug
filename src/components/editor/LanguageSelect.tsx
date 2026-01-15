'use client';

import { Select } from '@/components/ui';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/types';

interface LanguageSelectProps {
  value: SupportedLanguage;
  onChange: (value: SupportedLanguage) => void;
  disabled?: boolean;
}

export default function LanguageSelect({
  value,
  onChange,
  disabled = false,
}: LanguageSelectProps) {
  return (
    <Select
      label="Programming Language"
      value={value}
      onChange={(e) => onChange(e.target.value as SupportedLanguage)}
      disabled={disabled}
      options={SUPPORTED_LANGUAGES.map((lang) => ({
        value: lang.value,
        label: lang.label,
      }))}
    />
  );
}
