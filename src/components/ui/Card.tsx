import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 border-b border-zinc-200 dark:border-zinc-800', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('px-6 py-4', className)} {...props} />;
  }
);

CardContent.displayName = 'CardContent';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-6 py-4 border-t border-zinc-200 dark:border-zinc-800',
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
