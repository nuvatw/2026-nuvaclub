/**
 * Unified Icon System
 *
 * Usage:
 * import { SearchIcon, UserIcon, Icon } from '@/components/icons';
 *
 * // Direct import (tree-shakeable, recommended)
 * <SearchIcon size="md" />
 *
 * // Dynamic import (when icon name is a variable)
 * <Icon name="search" size="md" />
 *
 * Sizes:
 * - sm: 16px
 * - md: 20px (default)
 * - lg: 24px
 */

export {
  // Types
  type IconProps,
  type IconSize,
  type IconName,

  // Base component
  IconBase,
  Icon,
  ICONS,

  // Navigation
  SearchIcon,
  MenuIcon,
  XIcon,
  HomeIcon,

  // Chevrons & Arrows
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,

  // User
  UserIcon,
  UsersIcon,
  LogoutIcon,

  // Actions
  PlusIcon,
  MinusIcon,
  CheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EditIcon,
  CopyIcon,
  ShareIcon,
  DownloadIcon,
  UploadIcon,
  RefreshIcon,
  FilterIcon,
  SortIcon,

  // Media
  PlayIcon,
  PlaySolidIcon,
  PauseIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  ExpandIcon,
  ImageIcon,

  // Content
  BookIcon,
  BookOpenIcon,
  DocumentIcon,
  ClipboardIcon,
  FolderIcon,

  // Communication
  ChatIcon,
  ChatBubbleIcon,
  BellIcon,
  MailIcon,

  // Commerce
  ShoppingCartIcon,
  ShoppingBagIcon,
  CubeIcon,
  CreditCardIcon,
  TagIcon,
  GiftIcon,

  // Status
  StarIcon,
  StarSolidIcon,
  HeartIcon,
  HeartSolidIcon,
  BookmarkIcon,
  BookmarkSolidIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  FireIcon,
  TrendingUpIcon,
  ChartBarIcon,

  // Info
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,

  // Time/Date
  CalendarIcon,
  ClockIcon,

  // Location
  LocationIcon,
  GlobeIcon,

  // Misc
  SettingsIcon,
  LockIcon,
  UnlockIcon,
  EyeIcon,
  EyeOffIcon,
  LightBulbIcon,
  SparklesIcon,
  AcademicCapIcon,
  PinIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  SpinnerIcon,
  ShieldIcon,
} from './Icon';
