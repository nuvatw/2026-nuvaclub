/**
 * Home Page Content
 *
 * Content constants for the crowdfunding-style landing page.
 * Designed to sell the dream and drive early-bird funding.
 */

// ==========================================
// CAMPAIGN CONFIGURATION
// ==========================================

export const CAMPAIGN_CONFIG = {
  goalAmount: 1_000_000,
  currency: 'NT$',
  initialRaised: 0,
  storageKey: 'nuvaclub_campaign_raised',
  baseMonthlyPrice: 990, // Base price per month for Voyager
  customTierMonthlyPrice: 400, // Price per month for custom tier
  // Countdown end date: Feb 28, 2026 23:59:59 Taiwan time (UTC+8)
  countdownEndDate: '2026-02-28T23:59:59+08:00',
} as const;

// ==========================================
// HERO SECTION (Dream Pitch)
// ==========================================

export const HERO_CONTENT = {
  badge: '早鳥募資中',
  headline: {
    line1: '讓每個人都能',
    line2: '掌握 AI 的力量',
  },
  subheadline:
    '我們正在打造台灣最完整的 AI 學習社群——結合課程、導師、社群與實戰。成為早鳥贊助者，一起定義 AI 教育的未來。',
  primaryCta: '成為早鳥贊助者',
  secondaryCta: '看創辦人的故事',
  trustText: '已有 127 位贊助者加入我們的旅程',
} as const;

export const HERO_VIDEO_ID = 'dLRdaUda8Ho';

// ==========================================
// FOUNDER VIDEO SECTION
// ==========================================

export const FOUNDER_VIDEO_CONTENT = {
  badge: '創辦人的話',
  headline: '10 分鐘，了解我們的願景',
  subheadline:
    '為什麼我們要打造 nuvaClub？這個平台將如何改變 AI 學習的方式？讓創辦人親自告訴你。',
  videoId: 'dLRdaUda8Ho', // Replace with actual founder video
  duration: '10:23',
  chapters: [
    { time: '0:00', title: '為什麼創立 nuvaClub' },
    { time: '2:30', title: '我們要解決什麼問題' },
    { time: '5:00', title: '平台功能介紹' },
    { time: '7:30', title: '早鳥贊助方案' },
    { time: '9:00', title: '未來發展藍圖' },
  ],
} as const;

// ==========================================
// FUNDING TIERS (Voyager Plan)
// ==========================================

export const FUNDING_CONTENT = {
  badge: '早鳥限定方案',
  headline: '選擇你的贊助方案',
  subheadline: 'Voyager 方案 — 完整解鎖所有平台功能，包含課程、導師配對、社群與專案挑戰',
  basePrice: 990,
  basePlanName: 'Voyager',
} as const;

export const FUNDING_TIERS = [
  {
    id: 'tier-1',
    name: '買 2 送 1',
    subtitle: '入門體驗',
    payMonths: 2,
    getMonths: 3,
    price: 1980, // 2 x 990
    originalValue: 2970, // 3 x 990
    perks: [
      '完整課程存取權',
      '社群討論區參與',
      '專案挑戰投稿權',
      '12 級 AI 能力測驗',
      '五月後每月一堂新課程',
    ],
    highlight: false,
    badge: null,
    limitedQty: null,
  },
  {
    id: 'tier-2',
    name: '買 3 送 3',
    subtitle: '深度學習',
    payMonths: 3,
    getMonths: 6,
    price: 2970, // 3 x 990
    originalValue: 5940, // 6 x 990
    perks: [
      '完整課程存取權',
      '社群討論區參與',
      '專案挑戰投稿權',
      '12 級 AI 能力測驗',
      '五月後每月一堂新課程',
    ],
    highlight: false,
    badge: '熱門選擇',
    limitedQty: null,
    exclusivePerks: [
      {
        icon: '🎒',
        title: 'nuva 限定帆布袋',
      },
    ],
  },
  {
    id: 'tier-3',
    name: '買 5 送 7',
    subtitle: '一年完整旅程',
    payMonths: 5,
    getMonths: 12,
    price: 4950, // 5 x 990
    originalValue: 11880, // 12 x 990
    perks: [
      '完整課程存取權',
      '社群討論區參與',
      '專案挑戰投稿權',
      '12 級 AI 能力測驗',
      '五月後每月一堂新課程',
    ],
    highlight: true,
    badge: '最佳價值',
    limitedQty: null,
    exclusivePerks: [
      {
        icon: '🎒',
        title: 'nuva 限定帆布袋',
      },
      {
        icon: '🎟️',
        title: '產品發佈會入場門票',
      },
    ],
  },
] as const;

// Custom tier configuration
export const CUSTOM_TIER_CONFIG = {
  id: 'tier-custom',
  name: '自訂金額',
  subtitle: '支持我們的夢想',
  minPrice: 10000, // Minimum NT$10,000
  perks: [
    '完整課程存取權',
    '社群討論區參與',
    '專案挑戰投稿權',
    '12 級 AI 能力測驗',
    '五月後每月一堂新課程',
  ],
  exclusivePerks: [
    {
      icon: '🎒',
      title: 'nuva 限定帆布袋',
      color: 'amber', // default amber
    },
    {
      icon: '🎟️',
      title: '產品發佈會 VIP 門票',
      color: 'red', // red for VIP
    },
    {
      icon: '🎁',
      title: '神秘夢想者徽章',
      color: 'red', // red
    },
  ],
} as const;

// ==========================================
// CHECKOUT FORM
// ==========================================

export const CHECKOUT_FORM = {
  title: '填寫贊助資訊',
  fields: {
    name: { label: '姓名', placeholder: '請輸入您的姓名' },
    email: { label: '電子信箱', placeholder: 'example@email.com' },
    phone: { label: '手機號碼', placeholder: '0912345678' },
    cardNumber: { label: '信用卡號', placeholder: '1234 5678 9012 3456' },
    cardExpiry: { label: '有效期限', placeholder: 'MM/YY' },
    cardCvc: { label: '安全碼', placeholder: 'CVC' },
  },
  submitButton: '確認付款',
  cancelButton: '取消',
} as const;

export const OTP_MODAL = {
  title: '簡訊驗證',
  description: '請輸入您手機收到的驗證碼',
  placeholder: '請輸入 8 位驗證碼',
  correctCode: 'WUL45J03',
  submitButton: '驗證',
  resendButton: '重新發送',
  errorMessage: '驗證碼錯誤，請重新輸入',
} as const;

// ==========================================
// ATTENDEE SELECTION
// ==========================================

export const ATTENDEE_SELECTION = {
  title: '選擇人數',
  subtitle: '您要為幾位參加者購買此方案？',
  maxAttendees: 5,
  labels: {
    person: '位',
    perPerson: '每人',
    total: '總計',
    continue: '繼續結帳',
  },
} as const;

// ==========================================
// CELEBRATION / SUCCESS
// ==========================================

export const CELEBRATION_CONTENT = {
  title: '感謝您的贊助！',
  subtitle: '您已成為 nuvaClub 早鳥贊助者',
  description: '我們會透過 Email 通知您最新進度，敬請期待！',
  closeButton: '關閉',
  backerCardTitle: '贊助成功',
  backerLabel: '贊助者編號',
  shareTitle: '分享給朋友',
  shareButtons: [
    { id: 'instagram', label: 'IG 限時動態', icon: '📸' },
    { id: 'line', label: 'LINE', icon: '💬' },
    { id: 'copy', label: '複製連結', icon: '🔗' },
  ],
  progressLabel: '募資進度更新',
  newPledgeLabel: '+您的贊助',
} as const;

// ==========================================
// CROWDFUNDING CHECKOUT
// ==========================================

export const CROWDFUNDING_CHECKOUT = {
  pageTitle: '早鳥贊助結帳',
  steps: [
    { id: 'cart', label: '確認訂單', icon: '🛒' },
    { id: 'checkout', label: '填寫資料', icon: '📝' },
    { id: 'complete', label: '完成贊助', icon: '✓' },
  ],
  sections: {
    participants: {
      title: '參加者資料',
      subtitle: '請填寫每位參加者的資料',
    },
    purchaser: {
      title: '訂購人資料',
      subtitle: '您的聯絡資訊',
    },
    payment: {
      title: '付款方式',
      subtitle: '選擇您的付款方式',
    },
    invoice: {
      title: '發票資訊',
      subtitle: '選擇發票類型',
    },
  },
  fields: {
    name: { label: '姓名', placeholder: '請輸入姓名' },
    email: { label: '電子信箱', placeholder: 'example@email.com' },
    phone: { label: '手機號碼', placeholder: '0912345678' },
    companyName: { label: '公司名稱', placeholder: '請輸入公司名稱' },
    taxId: { label: '統一編號', placeholder: '請輸入 8 位統一編號' },
  },
  invoiceTypes: [
    { id: 'personal', label: '個人發票（二聯式）' },
    { id: 'company', label: '公司發票（三聯式）' },
  ],
  paymentMethods: [
    { id: 'credit_card', label: '信用卡', icon: '💳' },
  ],
  buttons: {
    back: '返回',
    continue: '繼續',
    placeOrder: '確認付款',
    backToHome: '返回首頁',
  },
} as const;

// ==========================================
// PLATFORM PREVIEW (Module Cards)
// ==========================================

export const PLATFORM_PREVIEW_CONTENT = {
  badge: '平台功能預覽',
  headline: '探索 nuvaClub 的世界',
  subheadline: '點擊預覽各功能模組。完整功能將於正式上線後開放，感謝你的耐心等候。',
} as const;

export const PLATFORM_MODULES = [
  {
    icon: '📚',
    title: 'Learn',
    subtitle: '結構化課程',
    description: '從 ChatGPT 基礎到進階自動化，系統化學習 AI 實戰技能',
    href: '/learn',
    color: 'from-blue-500/20 to-blue-600/10',
    borderColor: 'border-blue-500/30',
    status: 'preview' as const,
  },
  {
    icon: '🧪',
    title: 'Test',
    subtitle: 'AI 能力測驗',
    description: '12 級認證系統，測試你的 AI 能力並獲得證書',
    href: '/test',
    color: 'from-green-500/20 to-green-600/10',
    borderColor: 'border-green-500/30',
    status: 'preview' as const,
  },
  {
    icon: '💬',
    title: 'Forum',
    subtitle: '社群討論',
    description: '與其他學習者交流，獲得專家解答與資源分享',
    href: '/forum',
    color: 'from-yellow-500/20 to-yellow-600/10',
    borderColor: 'border-yellow-500/30',
    status: 'preview' as const,
  },
  {
    icon: '🤝',
    title: 'Space',
    subtitle: '導師配對',
    description: '尋找你的 Nunu 導師，獲得一對一指導與支持',
    href: '/space',
    color: 'from-purple-500/20 to-purple-600/10',
    borderColor: 'border-purple-500/30',
    status: 'preview' as const,
  },
  {
    icon: '🚀',
    title: 'Sprint',
    subtitle: '專案挑戰',
    description: '參與季度挑戰，打造作品集並獲得社群回饋',
    href: '/sprint',
    color: 'from-orange-500/20 to-orange-600/10',
    borderColor: 'border-orange-500/30',
    status: 'preview' as const,
  },
  {
    icon: '🛒',
    title: 'Shop',
    subtitle: '商店與活動',
    description: '獨家工作坊、實體活動與限量周邊商品',
    href: '/shop',
    color: 'from-pink-500/20 to-pink-600/10',
    borderColor: 'border-pink-500/30',
    status: 'preview' as const,
  },
] as const;

// ==========================================
// FAQ SECTION (Crowdfunding Focus)
// ==========================================

export const FAQ_CONTENT = {
  headline: '常見問題',
  subheadline: '關於早鳥贊助的疑問，我們都幫你整理好了',
} as const;

export const FAQ_ITEMS = [
  {
    question: '贊助後什麼時候可以開始使用？',
    answer:
      '您現在就可以預覽平台的各項功能模組！預計 7/1 全平台開放，3/1 開始會有 Learn 可以使用。早鳥贊助者將優先獲得正式版存取權，並享有即時早鳥優惠。',
  },
  {
    question: '買 X 送 Y 是什麼意思？',
    answer:
      '這是我們的早鳥限定優惠！例如「買 3 送 3」表示您支付 3 個月的費用（NT$2,970），但可以獲得 6 個月的完整使用權。這是感謝早期支持者的特別方案，正式上線後將不再提供。',
  },
  {
    question: '2026年5月23號邀請制產品發佈會是什麼？',
    answer:
      '這是專屬於「買 5 送 7」方案及自訂金額贊助者的邀請制實體活動。您將有機會與創辦人面對面交流、認識其他早期支持者，並獲得獨家的平台搶先體驗。活動地點位於台北，詳細資訊將於活動前通知。',
  },
  {
    question: '我可以送給朋友嗎？',
    answer:
      '可以！您可以在正式上線後將您的贊助資格轉移給指定的朋友。轉移功能將在會員後台提供，操作簡單且免費。',
  },
  {
    question: '如果我不滿意可以退款嗎？',
    answer:
      '我們提供 14 天無條件退款保證。如果您在贊助後 14 天內對任何原因不滿意，只需聯繫我們即可獲得全額退款，無需說明理由。',
  },
  {
    question: '我需要有 AI 或程式背景嗎？',
    answer:
      '完全不需要！nuvaClub 的課程從零基礎開始設計。只要您會使用電腦和網路，就能跟著我們的課程學習 AI。我們有許多成功學員都是從完全沒有技術背景開始的。',
  },
  {
    question: '可以開立公司發票打統編嗎？',
    answer:
      '可以！我們支援開立三聯式發票。在結帳時選擇「公司發票」，填入公司名稱及統一編號即可。發票將於付款完成後以電子發票形式寄送至您的信箱。',
  },
] as const;

// ==========================================
// FINAL CTA
// ==========================================

export const FINAL_CTA_CONTENT = {
  headline: 'AI 時代已經來臨',
  headlineHighlight: '你準備好了嗎？',
  subheadline:
    '成為 nuvaClub 的早鳥贊助者，與我們一起打造 AI 學習的未來。限量方案，售完即止。',
  primaryCta: '立即成為贊助者',
  trustPoints: [
    '14 天無條件退款',
    '限量早鳥優惠',
    '正式上線優先存取',
  ],
} as const;

// ==========================================
// TOAST MESSAGES
// ==========================================

export const TOAST_MESSAGES = {
  pledgeSuccess: {
    title: '感謝您的贊助！',
    description: '您已成功加入早鳥贊助者的行列。我們會透過 Email 通知您最新進度。',
  },
  pledgeError: {
    title: '贊助失敗',
    description: '很抱歉，發生了一些問題。請稍後再試或聯繫客服。',
  },
} as const;

// ==========================================
// LEGACY EXPORTS (for backward compatibility)
// ==========================================

export const STATS = [
  { value: '127', label: '早鳥贊助者' },
  { value: '10+', label: 'AI 課程' },
  { value: '100 萬', label: '募資目標' },
  { value: '5/23', label: '邀請制發佈會' },
] as const;

export const LOGO_PARTNERS = [
  { name: 'ChatGPT', logo: '🤖' },
  { name: 'Notion AI', logo: '📝' },
  { name: 'Midjourney', logo: '🎨' },
  { name: 'Claude', logo: '🧠' },
] as const;

// Legacy exports for any remaining dependencies
export const PROBLEM_CONTENT = { headline: '', subheadline: '', transition: '' } as const;
export const PAIN_POINTS = [] as const;
export const HOW_IT_WORKS_CONTENT = { badge: '', headline: '', subheadline: '' } as const;
export const HOW_IT_WORKS_STEPS = [] as const;
export const BENEFITS_CONTENT = { headline: '', subheadline: '' } as const;
export const KEY_BENEFITS = [] as const;
export const COURSES_CONTENT = { headline: '', subheadline: '', cta: '', freeChapter: '' } as const;
export const FEATURED_COURSES = [] as const;
export const MENTORSHIP_CONTENT = { badge: '', headline: '', headlineHighlight: '', description: '', cta: '' } as const;
export const MENTORSHIP_FEATURES = [] as const;
export const TESTIMONIALS_CONTENT = { headline: '', subheadline: '' } as const;
export const TESTIMONIALS = [] as const;
export const COMPARISON_CONTENT = { headline: '', subheadline: '' } as const;
export const COMPARISON_ITEMS = [] as const;
export const PILLARS = [] as const;
export const PRICING_TIERS = [] as const;
