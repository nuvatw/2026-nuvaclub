'use client';

import { type SVGProps } from 'react';
import { cn } from '@/lib/utils';

/**
 * Unified Icon System
 *
 * Design System Standards:
 * - Stroke width: 1.5 (consistent across all icons)
 * - Sizes: sm=16px, md=20px, lg=24px
 * - ViewBox: 24x24 (standard)
 * - Color: currentColor (inherits from parent)
 */

export type IconSize = 'sm' | 'md' | 'lg';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: IconSize;
  className?: string;
}

const SIZE_MAP: Record<IconSize, string> = {
  sm: 'w-4 h-4',   // 16px
  md: 'w-5 h-5',   // 20px
  lg: 'w-6 h-6',   // 24px
};

// Base SVG wrapper with consistent props
export function IconBase({
  size = 'md',
  className,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={cn(SIZE_MAP[size], className)}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// ============================================================================
// NAVIGATION ICONS
// ============================================================================

export function SearchIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </IconBase>
  );
}

export function MenuIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </IconBase>
  );
}

export function XIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M6 18L18 6M6 6l12 12" />
    </IconBase>
  );
}

export function HomeIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </IconBase>
  );
}

// ============================================================================
// CHEVRON / ARROW ICONS
// ============================================================================

export function ChevronLeftIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M15 19l-7-7 7-7" />
    </IconBase>
  );
}

export function ChevronRightIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M9 5l7 7-7 7" />
    </IconBase>
  );
}

export function ChevronUpIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5 15l7-7 7 7" />
    </IconBase>
  );
}

export function ChevronDownIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M19 9l-7 7-7-7" />
    </IconBase>
  );
}

export function ArrowRightIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </IconBase>
  );
}

export function ArrowLeftIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M11 17l-5-5m0 0l5-5m-5 5h12" />
    </IconBase>
  );
}

export function ExternalLinkIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </IconBase>
  );
}

// ============================================================================
// USER ICONS
// ============================================================================

export function UserIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </IconBase>
  );
}

export function UsersIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </IconBase>
  );
}

export function LogoutIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </IconBase>
  );
}

// ============================================================================
// ACTION ICONS
// ============================================================================

export function PlusIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 4v16m8-8H4" />
    </IconBase>
  );
}

export function MinusIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M20 12H4" />
    </IconBase>
  );
}

export function CheckIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5 13l4 4L19 7" />
    </IconBase>
  );
}

export function CheckCircleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function XCircleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function TrashIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </IconBase>
  );
}

export function EditIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </IconBase>
  );
}

export function CopyIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </IconBase>
  );
}

export function ShareIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </IconBase>
  );
}

export function DownloadIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </IconBase>
  );
}

export function UploadIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </IconBase>
  );
}

export function RefreshIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </IconBase>
  );
}

export function FilterIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </IconBase>
  );
}

export function SortIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </IconBase>
  );
}

// ============================================================================
// MEDIA ICONS
// ============================================================================

export function PlayIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function PlaySolidIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} fill="currentColor" stroke="none" {...props}>
      <path d="M8 5v14l11-7z" />
    </IconBase>
  );
}

export function PauseIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function VolumeUpIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </IconBase>
  );
}

export function VolumeOffIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </IconBase>
  );
}

export function ExpandIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </IconBase>
  );
}

export function ImageIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconBase>
  );
}

// ============================================================================
// CONTENT ICONS
// ============================================================================

export function BookIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </IconBase>
  );
}

export function BookOpenIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </IconBase>
  );
}

export function DocumentIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </IconBase>
  );
}

export function ClipboardIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </IconBase>
  );
}

export function FolderIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </IconBase>
  );
}

// ============================================================================
// COMMUNICATION ICONS
// ============================================================================

export function ChatIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </IconBase>
  );
}

export function ChatBubbleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </IconBase>
  );
}

export function BellIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </IconBase>
  );
}

export function MailIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </IconBase>
  );
}

// ============================================================================
// COMMERCE ICONS
// ============================================================================

export function ShoppingCartIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </IconBase>
  );
}

export function ShoppingBagIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </IconBase>
  );
}

export function CubeIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </IconBase>
  );
}

export function CreditCardIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </IconBase>
  );
}

export function TagIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </IconBase>
  );
}

export function GiftIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </IconBase>
  );
}

// ============================================================================
// STATUS ICONS
// ============================================================================

export function StarIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </IconBase>
  );
}

export function StarSolidIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} fill="currentColor" stroke="none" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </IconBase>
  );
}

export function HeartIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </IconBase>
  );
}

export function HeartSolidIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} fill="currentColor" stroke="none" {...props}>
      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
    </IconBase>
  );
}

export function BookmarkIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </IconBase>
  );
}

export function BookmarkSolidIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} fill="currentColor" stroke="none" {...props}>
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </IconBase>
  );
}

export function ThumbUpIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </IconBase>
  );
}

export function ThumbDownIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
    </IconBase>
  );
}

export function FireIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </IconBase>
  );
}

export function TrendingUpIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </IconBase>
  );
}

// ============================================================================
// INFO ICONS
// ============================================================================

export function InformationCircleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function QuestionMarkCircleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function ExclamationCircleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

export function ExclamationTriangleIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </IconBase>
  );
}

// ============================================================================
// TIME / DATE ICONS
// ============================================================================

export function CalendarIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </IconBase>
  );
}

export function ClockIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

// ============================================================================
// LOCATION ICONS
// ============================================================================

export function LocationIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconBase>
  );
}

export function GlobeIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </IconBase>
  );
}

// ============================================================================
// MISC ICONS
// ============================================================================

export function SettingsIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconBase>
  );
}

export function LockIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </IconBase>
  );
}

export function UnlockIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </IconBase>
  );
}

export function EyeIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </IconBase>
  );
}

export function EyeOffIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </IconBase>
  );
}

export function LightBulbIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </IconBase>
  );
}

export function SparklesIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </IconBase>
  );
}

export function AcademicCapIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </IconBase>
  );
}

export function PinIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
      <path d="M7 10h6v7a1 1 0 01-1 1H8a1 1 0 01-1-1v-7z" />
    </IconBase>
  );
}

export function MoreHorizontalIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </IconBase>
  );
}

export function MoreVerticalIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </IconBase>
  );
}

// ============================================================================
// ADMIN ICON
// ============================================================================

export function ShieldIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={className} {...props}>
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </IconBase>
  );
}

// ============================================================================
// LOADING ICON
// ============================================================================

export function SpinnerIcon({ size, className, ...props }: IconProps) {
  return (
    <IconBase size={size} className={cn('animate-spin', className)} {...props}>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </IconBase>
  );
}

// ============================================================================
// ICON NAME MAP (for dynamic usage if needed)
// ============================================================================

export const ICONS = {
  // Navigation
  search: SearchIcon,
  menu: MenuIcon,
  x: XIcon,
  home: HomeIcon,

  // Chevrons
  'chevron-left': ChevronLeftIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-down': ChevronDownIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  'external-link': ExternalLinkIcon,

  // User
  user: UserIcon,
  users: UsersIcon,
  logout: LogoutIcon,

  // Actions
  plus: PlusIcon,
  minus: MinusIcon,
  check: CheckIcon,
  'check-circle': CheckCircleIcon,
  'x-circle': XCircleIcon,
  trash: TrashIcon,
  edit: EditIcon,
  copy: CopyIcon,
  share: ShareIcon,
  download: DownloadIcon,
  upload: UploadIcon,
  refresh: RefreshIcon,
  filter: FilterIcon,
  sort: SortIcon,

  // Media
  play: PlayIcon,
  'play-solid': PlaySolidIcon,
  pause: PauseIcon,
  'volume-up': VolumeUpIcon,
  'volume-off': VolumeOffIcon,
  expand: ExpandIcon,
  image: ImageIcon,

  // Content
  book: BookIcon,
  'book-open': BookOpenIcon,
  document: DocumentIcon,
  clipboard: ClipboardIcon,
  folder: FolderIcon,

  // Communication
  chat: ChatIcon,
  'chat-bubble': ChatBubbleIcon,
  bell: BellIcon,
  mail: MailIcon,

  // Commerce
  'shopping-cart': ShoppingCartIcon,
  'shopping-bag': ShoppingBagIcon,
  'credit-card': CreditCardIcon,
  tag: TagIcon,
  gift: GiftIcon,

  // Status
  star: StarIcon,
  'star-solid': StarSolidIcon,
  heart: HeartIcon,
  'heart-solid': HeartSolidIcon,
  bookmark: BookmarkIcon,
  'bookmark-solid': BookmarkSolidIcon,
  'thumb-up': ThumbUpIcon,
  'thumb-down': ThumbDownIcon,
  fire: FireIcon,
  'trending-up': TrendingUpIcon,

  // Info
  'information-circle': InformationCircleIcon,
  'question-mark-circle': QuestionMarkCircleIcon,
  'exclamation-circle': ExclamationCircleIcon,
  'exclamation-triangle': ExclamationTriangleIcon,

  // Time/Date
  calendar: CalendarIcon,
  clock: ClockIcon,

  // Location
  location: LocationIcon,
  globe: GlobeIcon,

  // Misc
  settings: SettingsIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
  eye: EyeIcon,
  'eye-off': EyeOffIcon,
  'light-bulb': LightBulbIcon,
  sparkles: SparklesIcon,
  'academic-cap': AcademicCapIcon,
  pin: PinIcon,
  'more-horizontal': MoreHorizontalIcon,
  'more-vertical': MoreVerticalIcon,
  spinner: SpinnerIcon,
} as const;

export type IconName = keyof typeof ICONS;

// Dynamic icon component (use for cases where icon name is dynamic)
export function Icon({ name, ...props }: IconProps & { name: IconName }) {
  const IconComponent = ICONS[name];
  return <IconComponent {...props} />;
}
