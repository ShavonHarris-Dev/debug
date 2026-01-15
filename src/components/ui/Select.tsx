import { forwardRef, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  error?: string;
  hideLabel?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hideLabel = false, className, id, ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium text-zinc-700 dark:text-zinc-300',
            hideLabel && 'sr-only'
          )}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
