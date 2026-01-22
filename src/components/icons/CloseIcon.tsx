import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export function CloseIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      className={cn('w-5 h-5', className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
