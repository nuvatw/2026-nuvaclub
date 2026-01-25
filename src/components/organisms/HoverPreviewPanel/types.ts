export interface CardPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PinnedPosition {
  fixedTop: number;
  fixedLeft: number;
}

export interface PreviewConfig {
  width?: number;
  maxHeight?: number;
  openDelay?: number;
  closeDelay?: number;
  padding?: number;
}

export interface PreviewAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon';
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  activeLabel?: string;
  activeIcon?: React.ReactNode;
}

export interface PreviewData<T = unknown> {
  /** Unique instance ID for positioning (from useId()) */
  id: string;
  /** Original item ID (e.g., course.id) for consumers to match */
  itemId: string;
  item: T;
  position: CardPosition;
}

export interface HoverPreviewState<T = unknown> {
  data: PreviewData<T> | null;
  pinnedPosition: PinnedPosition | null;
  isOpen: boolean;
}

export const DEFAULT_CONFIG: Required<PreviewConfig> = {
  width: 400,
  maxHeight: 480,
  openDelay: 200,
  closeDelay: 100,
  padding: 16,
};
