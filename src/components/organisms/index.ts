/**
 * Organisms - Complex UI sections
 */

export { Navbar } from './Navbar';
export { Footer } from './Footer';
export { HeaderSearch } from './HeaderSearch';
export { HeroCarousel } from './HeroCarousel';
export { ProductGrid } from './ProductGrid';
export { CategorySidebar } from './CategorySidebar';
export { UserAvatarDropdown } from './UserAvatarDropdown';
export {
  HoverPreviewPanel,
  HoverPreviewProvider,
  HoverPreviewTrigger,
  useHoverPreviewContext,
  useScrollPinnedPosition,
} from './HoverPreviewPanel';
export type {
  CardPosition,
  PinnedPosition,
  PreviewConfig,
  PreviewAction,
  PreviewData,
  HoverPreviewState,
} from './HoverPreviewPanel';
export { DEFAULT_CONFIG } from './HoverPreviewPanel';
