/**
 * Playbook Content
 *
 * Content for the early-bird backer playbook page.
 * Contains authorized emails, member data, and development log entries.
 */

// Member data type
export interface PlaybookMember {
  email: string;
  name: string;
  backerNumber: number;
  tierName: string;
  months: number;
  joinDate: Date;
}

// Authorized members data
export const PLAYBOOK_MEMBERS: PlaybookMember[] = [
  {
    email: 'ceo@meetnuva.com',
    name: 'Brad',
    backerNumber: 1,
    tierName: '創始會員',
    months: 12,
    joinDate: new Date('2025-12-28'),
  },
  {
    email: 'oliver@meetnuva.com',
    name: 'Oliver',
    backerNumber: 2,
    tierName: '創始會員',
    months: 12,
    joinDate: new Date('2025-12-28'),
  },
];

// Get authorized emails from members
export const AUTHORIZED_EMAILS = PLAYBOOK_MEMBERS.map((m) => m.email);

// Get member by email
export function getMemberByEmail(email: string): PlaybookMember | null {
  const normalizedEmail = email.toLowerCase().trim();
  return (
    PLAYBOOK_MEMBERS.find(
      (m) => m.email.toLowerCase() === normalizedEmail
    ) || null
  );
}

// Log entry type
export interface PlaybookLogEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  tags?: string[];
}

// Development log entries
export const PLAYBOOK_LOGS: PlaybookLogEntry[] = [
  {
    id: 'log-001',
    date: new Date('2025-12-28'),
    title: '正式命名：nuvaClub',
    content: '經過多次討論與構思，我們正式將這個平台命名為 nuvaClub。這個名字代表了我們的願景——打造一個新世代的 AI 學習社群，讓每個人都能在這裡找到屬於自己的學習旅程。',
    tags: ['里程碑', '品牌'],
  },
  {
    id: 'log-002',
    date: new Date('2026-01-27'),
    title: '開始製作 Funding Page',
    content: '今天正式開始製作募資頁面。我們希望透過這個頁面，讓更多人了解 nuvaClub 的願景，並邀請早鳥贊助者一起參與這個旅程。募資頁面將包含方案介紹、平台預覽、FAQ 等內容。',
    tags: ['開發', '募資'],
  },
];

// Page content
export const PLAYBOOK_CONTENT = {
  title: 'Playbook',
  subtitle: '早鳥贊助者專屬更新日誌',
  description: '感謝你成為 nuvaClub 的早鳥贊助者。這裡記錄了我們的開發進度與重要里程碑。',
  loginTitle: '贊助者驗證',
  loginSubtitle: '請輸入您的贊助信箱以查看更新日誌',
  emailPlaceholder: '請輸入您的信箱',
  loginButton: '進入 Playbook',
  guestButton: '訪客瀏覽',
  errorMessage: '此信箱尚未註冊為贊助者，請確認信箱是否正確',
  emptyState: '目前還沒有更新日誌',
} as const;
