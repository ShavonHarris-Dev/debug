import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export default function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const initials = getInitials(alt);

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={sizeMap[size]}
        height={sizeMap[size]}
        className={cn(
          'rounded-full object-cover bg-zinc-200 dark:bg-zinc-700',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-blue-600 text-white flex items-center justify-center font-medium',
        sizeClasses[size],
        className
      )}
      role="img"
      aria-label={alt}
    >
      {initials}
    </div>
  );
}
