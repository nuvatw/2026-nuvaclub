/**
 * YouTube Video Pool
 *
 * Pool of unique YouTube video IDs for demo purposes.
 * Contains AI/tech educational content used across courses.
 */

export const YOUTUBE_VIDEO_POOL = [
  'aircAruvnKk', // 3Blue1Brown - Neural Networks
  'IHZwWFHWa-w', // 3Blue1Brown - Gradient Descent
  'Ilg3gGewQ5U', // 3Blue1Brown - Backpropagation
  'tIeHLnjs5U8', // 3Blue1Brown - Neural network 2
  'JTxsNm9IdYU', // ChatGPT introduction
  'ad79nYk2keg', // AI overview
  'kCc8FmEb1nY', // Andrej Karpathy - GPT from scratch
  'VMj-3S1tku0', // Deep Learning lecture
  'WXuK6gekU1Y', // Python for AI
  'rfscVS0vtbw', // Python Full Course
  'GwIo3gDZCVQ', // OpenAI API Tutorial
  '0kARDVL2nZg', // ChatGPT Tutorial
  'bQI5uDxrFfA', // Machine Learning basics
  'ukzFI9rgwfU', // ML for beginners
  'i_LwzRVP7bg', // Supervised learning
  'jHv63Uvk5VA', // AI Applications
  '_ZvnD96BVIs', // Prompt Engineering
  'sTeoEFzVNSc', // ChatGPT Tips
  'jC4v5AS4RIM', // AI Writing
  'uRQH2CFvedY', // AI Tools
  'VznoKyh6AXs', // AI for Students
  'YygA0b9yx2A', // Voice AI
  'PJXrs0uRCyw', // AI Photo Editing
  'SVcsDDABEkM', // AI Art Intro
  'qTgPSKKjfVg', // DALL-E
  'KzQn_3IAR30', // Image prompts
  'FW0x_PtTLNs', // AI styles
  'V2PN3XKrT7Q', // AI artwork
  'mJeNghZXtMo', // AI everyday
  '5dZ_lvDgevk', // Future of AI
] as const;

export type YouTubeVideoId = (typeof YOUTUBE_VIDEO_POOL)[number];

export const getRandomVideoId = (): string =>
  YOUTUBE_VIDEO_POOL[Math.floor(Math.random() * YOUTUBE_VIDEO_POOL.length)];

export const getVideoIdByIndex = (index: number): string =>
  YOUTUBE_VIDEO_POOL[index % YOUTUBE_VIDEO_POOL.length];
