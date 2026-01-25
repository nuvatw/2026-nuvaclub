// YouTube IFrame API types
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getPlaybackRate: () => number;
  setPlaybackRate: (rate: number) => void;
  getAvailablePlaybackRates: () => number[];
  setVolume: (volume: number) => void;
  getVolume: () => number;
  isMuted: () => boolean;
  mute: () => void;
  unMute: () => void;
  getVideoLoadedFraction: () => number;
  setOption: (module: string, option: string, value: unknown) => void;
  loadVideoById: (videoId: string) => void;
  destroy: () => void;
}

// Playback speed options
export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

// Report categories
export const REPORT_CATEGORIES = [
  { id: 'audio_sync', label: 'Audio out of sync' },
  { id: 'wrong_subtitles', label: 'Wrong subtitles' },
  { id: 'buffering', label: 'Video buffering / lag' },
  { id: 'wrong_content', label: 'Wrong episode content' },
  { id: 'offensive', label: 'Offensive / inappropriate content' },
  { id: 'other', label: 'Other' },
] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];
