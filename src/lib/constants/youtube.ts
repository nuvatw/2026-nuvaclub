/**
 * YouTube embed URL builder and related constants
 */

export interface YouTubeEmbedOptions {
  autoplay?: boolean;
  mute?: boolean;
  controls?: boolean;
  loop?: boolean;
  playlist?: string;
  rel?: boolean;
  modestbranding?: boolean;
  showinfo?: boolean;
}

const DEFAULT_OPTIONS: YouTubeEmbedOptions = {
  autoplay: true,
  mute: true,
  controls: false,
  loop: true,
  rel: false,
  modestbranding: true,
  showinfo: false,
};

/**
 * Build a YouTube embed URL with the specified options
 */
export function buildYouTubeEmbedUrl(
  videoId: string,
  options: YouTubeEmbedOptions = {}
): string {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const params = new URLSearchParams();

  if (mergedOptions.autoplay) params.set('autoplay', '1');
  if (mergedOptions.mute) params.set('mute', '1');
  if (!mergedOptions.controls) params.set('controls', '0');
  if (mergedOptions.loop) {
    params.set('loop', '1');
    params.set('playlist', mergedOptions.playlist || videoId);
  }
  if (!mergedOptions.rel) params.set('rel', '0');
  if (mergedOptions.modestbranding) params.set('modestbranding', '1');
  if (!mergedOptions.showinfo) params.set('showinfo', '0');

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Extract YouTube video ID from a URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}
